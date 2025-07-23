// src/app/page.tsx

'use client';
import LoadingState from './LoadingState';
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Container, Stack, Button, Snackbar, Alert, AppBar, Toolbar, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import apiClient from '../lib/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// --- 数据结构 (不变) ---
interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
}
interface FormData {
  name: string;
  meetingContext: string; // 交换了顺序
  work: string;
  appearance: string; // 将 hairstyle 改为 appearance
  personality: string;
  problem: string;
}

// --- 对话流程修改 ---
const conversationFlow = [
  { key: 'name', question: '宝贝最近怎么样，你跟TA还好吗？TA叫什么来着？' },
  { key: 'meetingContext', question: '{name}… 嗯，光是听名字就感觉很特别。你们是怎么认识的呀？一定很有趣吧！' },
  { key: 'work', question: '原来是这样认识的呀，真有缘分。那 {name} 是做什么工作的呢？' },
  { key: 'appearance', question: '嗯嗯，我有点好奇，可以跟我形容一下他的样子吗？比如身高、给人的感觉之类的。' },
  { key: 'personality', question: '听起来很有画面感了！那你觉得他这个人怎么样啊？你喜欢他的什么性格特点，讨厌的点也可以' },
  { key: 'problem', question: '谢谢你告诉我这么多关于他的事，亲爱的。可以跟我说说，最近是发生了什么事，让你感到困扰或者委屈了吗？' },
];

export default function ChatPage() {
  const [storyFinished, setStoryFinished] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});


  useEffect(() => {
    setMessages([{ id: 1, text: conversationFlow[0].question, sender: 'ai' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const validateInput = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'name':
        // 只保留长度校验
        if (value.length > 50) return '名字太长啦，最多50个字';
        return '';
      case 'problem':
        if (!value) return '别忘了告诉我你遇到的问题'; // 问题的非空校验依然保留，因为它是最后一个核心输入
        if (value.length > 600) return `你的倾诉我们都收到了，为了让故事更聚焦，请把问题浓缩在600字以内哦`;
        return '';
      case 'meetingContext':
        if (value.length > 300) return '描述太长啦，300字以内就好';
        return '';
      case 'work':
        if (value.length > 300) return '工作描述请保持在300字以内';
        return '';
      case 'appearance':
        if (value.length > 300) return '外貌描述在300字以内就够啦';
        return '';
      case 'personality':
        if (value.length > 300) return '性格描述在300字以内就好';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCurrentInput(value);

    // 实时验证
    const error = validateInput(name as keyof FormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  const handleSend = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: currentInput, sender: 'user' };

    const currentQuestionKey = conversationFlow[currentStep].key as keyof FormData;
    const error = validateInput(currentQuestionKey, currentInput);
    if (error) {
      setErrors(prev => ({ ...prev, [currentQuestionKey]: error }));
      return; // 如果有错误，就阻止发送
    }
    const updatedFormData = { ...formData, [currentQuestionKey]: currentInput };
    setFormData(updatedFormData);

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    const nextStep = currentStep + 1;
    if (nextStep < conversationFlow.length) {
      let nextQuestionText = conversationFlow[nextStep].question;
      if (nextQuestionText.includes('{name}')) {
        nextQuestionText = nextQuestionText.replace('{name}', updatedFormData.name || '');
      }

      const aiNextMessage: Message = { id: Date.now() + 1, text: nextQuestionText, sender: 'ai' };
      setTimeout(() => setMessages(prev => [...prev, aiNextMessage]), 500);
      setCurrentStep(nextStep);

    } else {
      // --- VVV 这里是本次的核心修改 VVV ---

      // 1. 立刻显示一个“我明白了”的确认和安慰消息
      const acknowledgementMessage: Message = {
        id: Date.now() + 1,
        // 使用你在截图中展示的、非常棒的文案
        text: '我明白了，眼前的问题没什么大不了的，让我来看看你们的未来是怎么幸福生活的。',
        sender: 'ai'
      };
      setMessages(prev => [...prev, acknowledgementMessage]);

      // 2. 稍等片刻 (比如2秒)，再进入全屏加载并调用API
      setTimeout(() => {
        // 2.1 显示全屏花瓣雨
        setIsLoading(true);

        // 2.2 在后台悄悄调用API
        const callApi = async () => {
          try {
            const response = await apiClient.post('/api/generate-story', updatedFormData);
            const storyMessage: Message = { id: Date.now() + 2, text: response.data.story, sender: 'ai' };
            // API成功返回后，用故事替换掉确认消息（或者直接追加）
            // 这里我们选择追加，保留上下文
            setMessages(prev => [...prev, storyMessage]);
            setStoryFinished(true);
          } catch (error) {
            console.error('API call failed:', error);
            const errorMessage: Message = { id: Date.now() + 2, text: '抱歉，故事生成失败了，请检查后端服务或稍后再试。', sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            // 2.3 故事出现后，隐藏加载画面
            setIsLoading(false);
          }
        };

        callApi();

      }, 2000); // 延迟2秒 (2000毫秒)
      // --- ^^^ 修改结束 ^^^ ---
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess(true);
      // 2秒后自动关闭提示
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleRegenerate = () => {
    // 这个函数直接调用 handleSend，但要确保使用的是最终的、完整的表单数据
    // 我们需要把调用API的逻辑抽出来
    // 为了简单起见，我们暂时把调用API的逻辑直接放在这里
    const callApi = async () => {
      setStoryFinished(false); // 隐藏旧的按钮
      const finalAiMessage: Message = { id: Date.now(), text: '好的，我们换一个角度，再来看一次你们美好的未来...', sender: 'ai' };
      setMessages(prev => [...prev, finalAiMessage]);
      setIsLoading(true);
      try {
        const response = await apiClient.post('/api/generate-story', formData);
        const storyMessage: Message = { id: Date.now() + 1, text: response.data.story, sender: 'ai' };
        setMessages(prev => [...prev, storyMessage]);
        setStoryFinished(true); // 故事生成后再次显示按钮
      } catch (error) {
        // ...错误处理...
      } finally {
        setIsLoading(false);
      }
    };
    callApi();
  };

  const handleReset = () => {
    // 重置所有状态到初始值
    setMessages([{ id: 1, text: conversationFlow[0].question, sender: 'ai' }]);
    setCurrentInput('');
    setCurrentStep(0);
    setFormData({});
    setIsLoading(false);
    setStoryFinished(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };
  const currentKey = conversationFlow[currentStep]?.key as keyof FormData;
  const currentError = errors[currentKey];

  return (
    // 1. 我们用一个最外层的 Box 作为容器
    <Box>

      {/* 2. 这是我们的第一个条件：当 isLoading 为 true 时，显示加载组件 */}
      {isLoading && <LoadingState />}

      {/* 3. 这是我们的第二个条件：当 isLoading 为 false 时，才显示我们整个聊天界面 */}
      {/* 我们用 !isLoading && (...) 把你之前所有的UI代码都包起来 */}
      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fffaf5' }}>
          <AppBar
            position="static"
            sx={{
              bgcolor: '#ffcdd2',
              // --- VVV 添加下面这两行 VVV ---
              borderBottomLeftRadius: '16px', // 左下角圆角
              borderBottomRightRadius: '16px', // 右下角圆角
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
                  sx={{ ml: 'auto', color: '#BDBDBD' }} // ml: 'auto' 把这个按钮推到最右边
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, width: '100%', bgcolor: '#ffffff' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <TextField fullWidth variant="outlined" name={currentKey} placeholder={isLoading ? "正在生成故事..." : "请输入你的回答..."} value={currentInput} onChange={handleChange} error={!!currentError} helperText={currentError || ' '} onKeyPress={handleKeyPress} disabled={isLoading || currentStep >= conversationFlow.length - 1 && Object.keys(formData).length >= conversationFlow.length} />
              <IconButton onClick={handleSend} disabled={isLoading || !currentInput.trim()} sx={{ color: '#ff8a80' }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Paper>
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