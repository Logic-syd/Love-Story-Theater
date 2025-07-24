// src/app/page.tsx

'use client';
import LoadingState from './LoadingState';
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Stack, Button, Snackbar, Alert, AppBar, Toolbar, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import apiClient from '../lib/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
}

export default function ChatPage() {
  const [storyFinished, setStoryFinished] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [storyInfo, setStoryInfo] = useState(''); // 用于累积用户信息

  // 用于保存每一步获取到的问题
  const [questions, setQuestions] = useState(['', '', '']);

  // 滚动到消息底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化获取第一个问题
  useEffect(() => {
    if (currentStep === 0 && questions[0] === '') {
      const fetchFirstQuestion = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.post('/api/question', { info: '' });
          const newQuestions = [...questions];
          newQuestions[0] = response.data.question;
          setQuestions(newQuestions);
          setMessages([{ id: 1, text: response.data.question, sender: 'ai' }]);
        } catch (err) {
          console.error('获取问题失败', err);
          const newQuestions = ['请告诉我一些关于故事背景的信息？', '', ''];
          setQuestions(newQuestions);
          setMessages([{ id: 1, text: newQuestions[0], sender: 'ai' }]);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchFirstQuestion();
    }
  }, [currentStep, questions]);

  // 调用question API获取问题
  const fetchQuestion = async (step: number, currentInfo: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/question', { info: currentInfo });
      const newQuestions = [...questions];
      newQuestions[step] = response.data.question;
      setQuestions(newQuestions);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response.data.question, sender: 'ai' }]);
    } catch (err) {
      console.error('获取问题失败', err);
      const newQuestions = [...questions];
      newQuestions[step] = '请继续分享更多故事细节？';
      setQuestions(newQuestions);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: newQuestions[step], sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 调用generate-story API生成故事
  const fetchGenerateStory = async (fullInfo: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/generate-story', { info: fullInfo });
      return response.data.story;
    } catch (err) {
      console.error('生成故事失败', err);
      return '抱歉，故事生成失败了，请稍后再试。';
    } finally {
      setIsLoading(false);
    }
  };

  // 处理用户提交的回答
  const handleSend = async () => {
    if (!currentInput.trim()) {
      setError('请填写内容');
      return;
    }
    
    if (currentInput.length > 600) {
      setError('回答内容过长，请控制在600字以内');
      return;
    }
    
    setError('');

    // 添加用户消息
    const userMessage: Message = { id: Date.now(), text: currentInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    // 更新累积的信息
    const updatedInfo = `${storyInfo}${currentInput}\n`;
    setStoryInfo(updatedInfo);
    
    setCurrentInput('');

    // 如果还有问题要问
    if (currentStep < 2) {
      const nextStep = currentStep + 1;
      
      // 获取下一个问题
      await fetchQuestion(nextStep, updatedInfo);
      
      // 进入下一步
      setCurrentStep(nextStep);
    } else {
      // 最后一步完成后显示确认消息
      const acknowledgementMessage: Message = {
        id: Date.now() + 1,
        text: '我明白了，眼前的问题没什么大不了的，让我来看看你们的未来是怎么幸福生活的。',
        sender: 'ai'
      };
      setMessages(prev => [...prev, acknowledgementMessage]);
      
      // 2秒后生成故事
      setTimeout(async () => {
        setIsLoading(true);
        const story = await fetchGenerateStory(updatedInfo);
        setMessages(prev => [...prev, { id: Date.now() + 2, text: story, sender: 'ai' }]);
        setStoryFinished(true);
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('复制失败: ', err);
    });
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    setStoryFinished(false);
    
    try {
      const responseMessage: Message = {
        id: Date.now(),
        text: '好的，我们换一个角度，再来看一次你们美好的未来...',
        sender: 'ai'
      };
      setMessages(prev => [...prev, responseMessage]);
      
      const story = await fetchGenerateStory(storyInfo);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: story, sender: 'ai' }]);
      setStoryFinished(true);
    } catch (err) {
      console.error('重新生成失败', err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: '重新生成失败，请稍后再试。', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentInput('');
    setCurrentStep(0);
    setStoryInfo('');
    setQuestions(['', '', '']);
    setIsLoading(false);
    setStoryFinished(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <Box>
      {isLoading && <LoadingState />}
      
      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fffaf5' }}>
          <AppBar
            position="static"
            sx={{
              bgcolor: '#ffcdd2',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
            }}
            elevation={1}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ color: '#5D4037' }}>
                我们一定会幸福～
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    bgcolor: msg.sender === 'user' ? '#ff8a80' : '#ffffff',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    maxWidth: '80%',
                    borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
            
            {/* 当前问题提示 */}
            {currentStep < 3 && !isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    bgcolor: '#ffffff',
                    maxWidth: '80%',
                    borderRadius: '20px 20px 20px 5px',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {questions[currentStep]}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            {storyFinished && !isLoading && (
              <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ ml: 1, mt: 1 }}>
                <Button variant="text" size="small" onClick={handleRegenerate} sx={{ color: '#ff8a80' }}>换一个梦境</Button>
                <Button variant="text" size="small" onClick={handleReset} sx={{ color: '#ff8a80' }}>我想改改细节</Button>
                <IconButton
                  size="small"
                  onClick={() => {
                    const lastMessage = messages.filter(m => m.sender === 'ai').pop();
                    if (lastMessage) handleCopy(lastMessage.text);
                  }}
                  sx={{ ml: 'auto', color: '#BDBDBD' }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {currentStep < 3 && (
            <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, width: '100%', bgcolor: '#ffffff' }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={isLoading ? "处理中..." : "请输入你的回答..."}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  rows={3}
                  multiline
                  error={!!error}
                  helperText={error || ' '}
                />
                <IconButton 
                  onClick={handleSend} 
                  disabled={isLoading || !currentInput.trim()} 
                  sx={{ color: '#ff8a80' }}
                >
                  {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </Box>
            </Paper>
          )}
        </Box>
      )}
      
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
          故事已复制到剪贴板！
        </Alert>
      </Snackbar>
    </Box>
  );
}