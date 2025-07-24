// src/app/page.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, AppBar, Toolbar, CircularProgress, Stack, Button, Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import apiClient from '../lib/api';
import LoadingState from './LoadingState';
import TypingIndicator from './TypingIndicator';

// --- 数据和问题结构 ---

interface Message {
  id: number;
  text?: string;
  sender: 'ai' | 'user';
  component?: React.ReactNode; // 新增一个可选的 component 属性
}

interface FormData {
  name: string;
  appearance: string;
  meetingContext: string;
  memories: string;
  problem: string;
}

const initialQuestionPool = [
  { key: 'name', questions: ['亲爱的，最近还好吗？我们慢慢聊。你心里念着的那个他，叫什么名字呀？', '宝贝，今天过得怎么样？可以告诉我那个让你挂心的他的名字吗？'] },
  { key: 'appearance', questions: ['嗯嗯，我有点好奇，可以跟我形容一下他的样子吗？比如身高、给人的感觉之类的。', '他一定很特别吧，可以给我描述一下他的外貌吗？'] },
  { key: 'meetingContext', questions: ['你们是怎么认识的呀？一定很有趣吧！', '真想听听你们相遇的故事，快跟我讲讲！'] },
];

const finalQuestions = [
  { key: 'memories', question: '' }, // Note: The actual question for this is generated dynamically by the AI.
  { key: 'problem', question: '谢谢你分享这么美好的回忆。那回到我们最开始的话题吧，亲爱的。最近是发生了什么事，让你感到困扰或者委屈了吗？' },
];

// --- 主组件 ---
export default function ChatPage() {
  // --- 状态管理 ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [questionPool, setQuestionPool] = useState([...initialQuestionPool]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [finalQuestionStep, setFinalQuestionStep] = useState(-1); // -1 means we are in the initial pool phase

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [messageIdCounter, setMessageIdCounter] = useState(1);

  // --- 核心逻辑 ---
  // 在 src/app/page.tsx 中，替换旧的 useEffect

  useEffect(() => {
    // --- 这是新的、正确的启动逻辑 ---

    // 1. 明确地从题库中找到“名字”这个问题，作为第一个问题
    const nameQuestion = initialQuestionPool.find(q => q.key === 'name');

    // 2. 从题库中筛选出除了“名字”以外的其他问题
    const otherQuestions = initialQuestionPool.filter(q => q.key !== 'name');

    // 3. 将剩下的其他问题进行随机排序
    const shuffledPool = otherQuestions.sort(() => Math.random() - 0.5);

    // 4. 开始对话
    if (nameQuestion) {
      // 从“名字”的提问方式中随机选一个
      const questionText = nameQuestion.questions[Math.floor(Math.random() * nameQuestion.questions.length)];

      // 设置初始状态
      setCurrentQuestion(nameQuestion); // 当前问题是“名字”
      setQuestionPool(shuffledPool);   // 待提问的随机池是剩下的问题
      setMessages([{ id: messageIdCounter, text: questionText, sender: 'ai' }]);
      setMessageIdCounter(prev => prev + 1);
    }
  }, []); // 这个空数组[]确保此逻辑只在页面加载时运行一次

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const validateInput = (name: keyof FormData, value: string): string => {
    // Your validation logic remains the same
    if (value.length > 600) return '内容太长啦，请保持在600字以内。'; // Simplified for all fields for now
    if (name === 'problem' && !value) return '别忘了告诉我你遇到的问题';
    return '';
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isLoading) return;

    const currentKey = currentQuestion.key as keyof FormData;
    const error = validateInput(currentKey, currentInput);
    if (error) {
      setErrors({ [currentKey]: error });
      return;
    } else {
      setErrors({});
    }

    let nextId = messageIdCounter;
    const userMessage: Message = { id: nextId++, text: currentInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    const updatedData = { ...formData, [currentKey]: currentInput };
    setFormData(updatedData);
    setCurrentInput('');

    // --- State Machine Logic ---
    if (questionPool.length > 0) {
      // Phase 1: Still in the random question pool
      const nextPool = [...questionPool];
      const nextQ = nextPool.pop()!;
      const questionText = nextQ.questions[Math.floor(Math.random() * nextQ.questions.length)];
      setCurrentQuestion(nextQ);
      setQuestionPool(nextPool);
      const aiMessage: Message = { id: nextId++, text: questionText, sender: 'ai' };
      setTimeout(() => setMessages(prev => [...prev, aiMessage]), 500);
    } else if (finalQuestionStep === -1) {
      // Phase 2: Pool is empty, trigger dynamic interaction
      setFinalQuestionStep(0); // Move to the final questions phase

      const interactionData = { name: updatedData.name, appearance: updatedData.appearance, meetingContext: updatedData.meetingContext };
      //const loadingMessage: Message = { id: nextId++, text: '嗯...让我想想...', sender: 'ai' };
      const loadingMessage: Message = { id: Date.now() + Math.random(), sender: 'ai', component: <TypingIndicator /> };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        const response = await apiClient.post('/api/dynamic-interaction', interactionData);
        const dynamicQuestion: Message = { id: nextId++, text: response.data.response, sender: 'ai' };
        setMessages(prev => [...prev.slice(0, -1), dynamicQuestion]);
        setCurrentQuestion(finalQuestions[0]);
      } catch (err) {
        const fallbackQuestion = "听起来你们的故事很美好。那你们之间有什么记忆深刻的事吗？";
        setMessages(prev => [...prev.slice(0, -1), { id: nextId++, text: fallbackQuestion, sender: 'ai' }]);
        setCurrentQuestion(finalQuestions[0]);
      }
    } else if (finalQuestionStep < finalQuestions.length - 1) {
      // Phase 3: Asking the final fixed questions
      const nextStepIndex = finalQuestionStep + 1;
      const nextQ = finalQuestions[nextStepIndex];
      setCurrentQuestion(nextQ);
      setFinalQuestionStep(nextStepIndex);
      const aiMessage: Message = { id: nextId++, text: nextQ.question, sender: 'ai' };
      setTimeout(() => setMessages(prev => [...prev, aiMessage]), 500);
    } else {
      // Phase 4: All data collected, generate final story
      const finalAiMessage: Message = { id: nextId++, text: '谢谢你的倾诉...请把剩下的交给我，我会把你的心情编织成一个温暖的故事来给你力量。', sender: 'ai' };
      setMessages(prev => [...prev, finalAiMessage]);
      setIsLoading(true);
      try {
        const response = await apiClient.post('/api/generate-story', updatedData);
        const storyMessage: Message = { id: nextId++, text: response.data.story, sender: 'ai' };
        setMessages(prev => [...prev, storyMessage]);
        setStoryFinished(true);
      } catch (err) {
        const errorMessage: Message = { id: nextId++, text: '抱歉，故事生成失败了...', sender: 'ai' };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
    setMessageIdCounter(nextId);
  };

  // ... (handleCopy, handleRegenerate, handleReset, onKeyPress functions remain the same as the last full version)
  const handleCopy = (textToCopy: string) => { /* ... */ };
  const handleRegenerate = () => { /* ... */ };
  const handleReset = () => { window.location.reload(); };
  const handleKeyPress = (event: React.KeyboardEvent) => { if (event.key === 'Enter') { handleSend(); } };

  // 在 page.tsx 的 export default function ChatPage() 中
  // ... (所有的 state 和函数都在这里) ...

  const currentKey = currentQuestion?.key as keyof FormData;
  const currentError = errors[currentKey];

  return (
    <Box>
      {/* 当 isLoading 为 true 时，显示全屏加载动画 */}
      {isLoading && <LoadingState />}

      {/* 当不加载时，才显示我们整个聊天界面 */}
      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fffaf5' }}>

          {/* --- 1. 页头 --- */}
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
                你的情感慰藉小屋
              </Typography>
            </Toolbar>
          </AppBar>

          {/* --- 2. 聊天消息列表 --- */}
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
                  {msg.component ? msg.component : (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
                  )}
                </Paper>
              </Box>
            ))}

            {/* --- 故事生成后的操作按钮 --- */}
            {storyFinished && !isLoading && (
              <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ ml: 1, mt: 1 }}>
                <Button variant="text" size="small" onClick={handleRegenerate} sx={{ color: '#ff8a80' }}>换一个梦境</Button>
                <Button variant="text" size="small" onClick={handleReset} sx={{ color: '#ff8a80' }}>开启新对话</Button>
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

            {/* 用于自动滚动的隐形标记 */}
            <div ref={messagesEndRef} />
          </Box>

          {/* --- 3. 底部输入区域 --- */}
          <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, width: '100%', bgcolor: '#ffffff' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                name={currentKey}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                error={!!currentError}
                helperText={currentError || ' '}
                onKeyPress={handleKeyPress}
                disabled={isLoading || storyFinished}
                placeholder="请输入你的回答..."
              />
              <IconButton onClick={handleSend} disabled={isLoading || !currentInput.trim()} sx={{ color: '#ff8a80' }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Paper>
        </Box>
      )}

      {/* --- 4. “复制成功”的全局提示 --- */}
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
          故事已复制到剪贴板！
        </Alert>
      </Snackbar>
    </Box>
  );
}