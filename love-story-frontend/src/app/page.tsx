// src/app/page.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Container, AppBar, Toolbar, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import apiClient from '../lib/api';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: 1, text: conversationFlow[0].question, sender: 'ai' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 在 src/app/page.tsx 中，替换旧的 handleSend 函数

  const handleSend = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: currentInput, sender: 'user' };

    // 我们把更新表单数据的逻辑提前，以便在下一个问题中使用
    const currentQuestionKey = conversationFlow[currentStep].key as keyof FormData;
    const updatedFormData = { ...formData, [currentQuestionKey]: currentInput };
    setFormData(updatedFormData);

    // 更新聊天记录并清空输入框
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    const nextStep = currentStep + 1;
    if (nextStep < conversationFlow.length) {

      // --- VVV 这里是唯一的修改 VVV ---

      let nextQuestionText = conversationFlow[nextStep].question;
      // 检查问题中是否包含 {name} 占位符
      if (nextQuestionText.includes('{name}')) {
        // 从已经保存的、更新后的表单数据中获取名字来替换，而不是用 currentInput
        nextQuestionText = nextQuestionText.replace('{name}', updatedFormData.name || '');
      }
      // --- ^^^ 修改结束 ^^^ ---

      const aiNextMessage: Message = { id: Date.now() + 1, text: nextQuestionText, sender: 'ai' };
      setTimeout(() => setMessages(prev => [...prev, aiNextMessage]), 500);
      setCurrentStep(nextStep);

    } else {
      // 对话结束，准备调用API (这部分逻辑不变)
      const finalAiMessage: Message = { id: Date.now() + 1, text: '我明白了，眼前的问题没什么大不了的，让我来看看你们的未来是怎么幸福生活的', sender: 'ai' };
      setTimeout(async () => {
        setMessages(prev => [...prev, finalAiMessage]);
        setIsLoading(true);
        try {
          const response = await apiClient.post('/api/generate-story', updatedFormData);
          const storyMessage: Message = { id: Date.now() + 2, text: response.data.story, sender: 'ai' };
          setMessages(prev => [...prev, storyMessage]);
        } catch (error) {
          console.error('API call failed:', error);
          const errorMessage: Message = { id: Date.now() + 2, text: '抱歉，故事生成失败了，请检查后端服务或稍后再试。', sender: 'ai' };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fffaf5' }}> {/* 背景改成更柔和的米白色 */}
      {/* --- 视觉修改: AppBar颜色 --- */}
      <AppBar position="static" sx={{ bgcolor: '#ffcdd2' }} elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ color: '#5D4037' }}>
            你是幸福的
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
                // --- 视觉修改: 聊天气泡颜色 ---
                bgcolor: msg.sender === 'user' ? '#ff8a80' : '#ffffff', // 用户气泡用珊瑚粉
                color: msg.sender === 'user' ? 'white' : 'black',
                maxWidth: '80%',
                borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, width: '100%', bgcolor: '#ffffff' }}>
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
          <TextField fullWidth variant="outlined" size="small" placeholder={isLoading ? "正在生成故事..." : "请输入你的回答..."} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading || currentStep >= conversationFlow.length - 1 && Object.keys(formData).length >= conversationFlow.length} />
          {/* --- 视觉修改: 发送按钮颜色 --- */}
          <IconButton onClick={handleSend} disabled={isLoading || !currentInput.trim()} sx={{ color: '#ff8a80' }}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}