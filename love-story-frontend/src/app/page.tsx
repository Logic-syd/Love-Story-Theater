// src/app/page.tsx - 最终修复版

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, AppBar, Toolbar, CircularProgress, Stack, Button, Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import apiClient from '../lib/api';
import LoadingState from './LoadingState';
import TypingIndicator from './TypingIndicator';
import LanguageSwitcher from './LanguageSwitcher';
import { content } from '../lib/conversationContent';

interface Message { id: number; sender: 'ai' | 'user'; text?: string; component?: React.ReactNode; }
interface FormData { name?: string; meetingContext?: string; memories?: string; appearance?: string; work?: string; personality?: string; problem?: string; }

export default function ChatPage() {
  const [language, setLanguage] = useState('zh');
  const currentContent = content[language];

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [conversationPhase, setConversationPhase] = useState('asking_name');
  const [questionPoolA, setQuestionPoolA] = useState<any[]>([]);
  const [questionPoolB, setQuestionPoolB] = useState<any[]>([]);
  const [cleanupQueue, setCleanupQueue] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [pendingAiMessage, setPendingAiMessage] = useState<Message | null>(null);




  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const nameQuestion = currentContent.nameQuestion;
    const questionText = nameQuestion.texts[Math.floor(Math.random() * nameQuestion.texts.length)];

    setQuestionPoolA([...currentContent.poolA].sort(() => Math.random() - 0.5));
    setQuestionPoolB([...currentContent.poolB].sort(() => Math.random() - 0.5));

    setCurrentQuestion(nameQuestion);
    setMessages([{ id: Date.now() + Math.random(), text: questionText, sender: 'ai' }]);

    setConversationPhase('asking_name');
    setStoryFinished(false);
    setFormData({});
    setCurrentInput('');
  }, [language, currentContent]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const askQuestion = (questionObj: any) => {
    const questionText = questionObj.texts[Math.floor(Math.random() * questionObj.texts.length)];
    const aiMessage: Message = { id: Date.now() + Math.random(), text: questionText, sender: 'ai' };
    setCurrentQuestion(questionObj);
    setTimeout(() => setMessages(prev => [...prev, aiMessage]), 500);
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now() + Math.random(), text: currentInput, sender: 'user' };
    const currentKey = currentQuestion.key as keyof FormData;
    const updatedData = { ...formData, [currentKey]: currentInput };

    let messagesToAdd: Message[] = [];
    if (pendingAiMessage) {
      messagesToAdd.push(pendingAiMessage);
      setPendingAiMessage(null);
    }
    messagesToAdd.push(userMessage);

    setMessages(prev => [...prev, ...messagesToAdd]);
    setFormData(updatedData);
    setCurrentInput('');

    switch (conversationPhase) {
      case 'asking_name':
        const nextQuestionFromA = questionPoolA.pop()!;
        askQuestion(nextQuestionFromA);
        setQuestionPoolA(questionPoolA);
        setConversationPhase('asking_pool_A_1');
        break;

      case 'asking_pool_A_1':
        // 1. 从B题库中随机选择下一个要提问的主题
        const topicForAi = questionPoolB.pop()!;
        setQuestionPoolB(questionPoolB); // 更新B题库（移除已选中的问题）

        // 2. 显示“正在输入”动画
        const typingMessage: Message = { id: Date.now() + Math.random(), sender: 'ai', component: <TypingIndicator /> };
        setMessages(prev => [...prev, typingMessage]);
        // 3. 将选择好的主题和上下文一起发给AI
        const interactionData = {
          name: updatedData.name,
          context: updatedData.meetingContext || updatedData.memories,
          topicToAsk: topicForAi.key,// <--- 告诉AI要问什么
          language: language
        };
        try {
          const response = await apiClient.post('/api/dynamic-interaction', interactionData);
          const dynamicQuestion: Message = { id: Date.now() + Math.random(), text: response.data.response, sender: 'ai' };
          // 4. 用AI的真实回复替换掉“正在输入...”动画
          setMessages(prev => [...prev.slice(0, -1), dynamicQuestion]);
          setCurrentQuestion(topicForAi); // 更新当前问题状态
        } catch (error) {
          // 错误处理...
          console.error("Dynamic interaction failed:", error);
          askQuestion(topicForAi);
          setMessages(prev => prev.slice(0, -1));
        }

        setConversationPhase('cleanup');
        break;

      case 'cleanup': {
        // Ask all remaining questions from the combined pools until empty.
        const cleanupPool = [...questionPoolA, ...questionPoolB].sort(() => Math.random() - 0.5);

        if (cleanupPool.length > 0) {
          const nextQuestion = cleanupPool.shift()!;
          askQuestion(nextQuestion);
          // Update the correct original pool
          if (currentContent.poolA.some(q => q.key === nextQuestion.key)) {
            setQuestionPoolA(prev => prev.filter(q => q.key !== nextQuestion.key));
          } else {
            setQuestionPoolB(prev => prev.filter(q => q.key !== nextQuestion.key));
          }
        } else {
          // All details gathered, ask the final problem question.
          askQuestion(currentContent.problemQuestion);
          setConversationPhase('asking_problem');
        }
        break;
      }

      case 'asking_problem': {
        const ackOptions = currentContent.finalAcknowledgement.texts;
        const ackText = ackOptions[Math.floor(Math.random() * ackOptions.length)];
        const finalAiMessage: Message = { id: Date.now() + Math.random(), text: ackText, sender: 'ai' };
        setMessages(prev => [...prev, finalAiMessage]);
        setCurrentQuestion(null);
        setConversationPhase('awaiting_final_ack');
        break;
      }
      case 'awaiting_final_ack':
        setIsLoading(true);
        try {
          const finalPayload = { ...updatedData, language: language };
          const response = await apiClient.post('/api/generate-story', finalPayload);
          const storyMessage: Message = { id: Date.now() + Math.random(), text: response.data.response, sender: 'ai' };
          setMessages(prev => [...prev, storyMessage]);
          setStoryFinished(true);
        } catch (err) {
          const errorMessage: Message = { id: Date.now() + Math.random(), text: '抱歉，故事生成失败了...', sender: 'ai' };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
        setConversationPhase('finished');
        break;
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => console.error('Failed to copy text: ', err));
  };

  const handleRegenerate = async () => {
    setStoryFinished(false);
    const thinkingMessage: Message = { id: Date.now() + Math.random(), text: "好的，我们换一个角度，再来看一次你们美好的未来...", sender: 'ai' };
    setMessages(prev => [...prev, thinkingMessage]);
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/generate-story', formData);
      const storyMessage: Message = { id: Date.now() + Math.random(), text: response.data.story, sender: 'ai' };
      setMessages(prev => [...prev, storyMessage]);
      setStoryFinished(true);
    } catch (error) {
      console.error('API call failed during regenerate:', error);
      const errorMessage: Message = { id: Date.now() + Math.random(), text: '抱歉，故事再次生成失败了...', sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => { window.location.reload(); };
  const handleKeyPress = (event: React.KeyboardEvent) => { if (event.key === 'Enter' && !isLoading) { handleSend(); } };

  return (
    <Box>
      {isLoading && <LoadingState />}
      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fffaf5' }}>
          <AppBar position="static" sx={{ bgcolor: '#ffcdd2', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }} elevation={1}>
            <Toolbar><Typography variant="h6" component="div" sx={{ color: '#5D4037' }}>{currentContent.appTitle}</Typography>
              <Box sx={{ flexGrow: 1 }} />
              {/* Add the new LanguageSwitcher component here */}
              <LanguageSwitcher language={language} setLanguage={setLanguage} /></Toolbar>
          </AppBar>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                <Paper elevation={2} sx={{ p: 1.5, bgcolor: msg.sender === 'user' ? '#ff8a80' : '#ffffff', color: msg.sender === 'user' ? 'white' : 'black', maxWidth: '80%', borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px' }}>
                  {msg.component ? msg.component : (<Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>)}
                </Paper>
              </Box>
            ))}
            {storyFinished && !isLoading && (
              <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ ml: 1, mt: 1 }}>
                <Button variant="text" size="small" onClick={handleRegenerate} sx={{ color: '#ff8a80' }}>{currentContent.buttons.regenerate}</Button>
                <Button variant="text" size="small" onClick={handleReset} sx={{ color: '#ff8a80' }}>{currentContent.buttons.reset}</Button>
                <IconButton size="small" onClick={() => { const lastMessage = messages.filter(m => m.sender === 'ai' && m.text).pop(); if (lastMessage) handleCopy(lastMessage.text!); }} sx={{ ml: 'auto', color: '#BDBDBD' }}><ContentCopyIcon fontSize="small" /></IconButton>
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, width: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <TextField fullWidth variant="outlined" placeholder={currentContent.inputPlaceholder} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading || storyFinished} />
              <IconButton onClick={handleSend} disabled={isLoading || !currentInput.trim()} sx={{ color: '#ff8a80' }}><SendIcon /></IconButton>
            </Box>
          </Paper>
        </Box>
      )}
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>{currentContent.copySuccessMessage}</Alert>
      </Snackbar>
    </Box>
  );
}