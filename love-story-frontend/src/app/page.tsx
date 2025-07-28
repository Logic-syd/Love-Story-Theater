// src/app/page.tsx - 最终修复版

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, AppBar, Toolbar, CircularProgress, Stack, Button, Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import apiClient from '../lib/api';
import LoadingState from './LoadingState';
import TypingIndicator from './TypingIndicator';
import { content } from '../lib/conversationContent';

interface Message { id: number; sender: 'ai' | 'user'; text?: string; component?: React.ReactNode; }
interface FormData { name?: string; meetingContext?: string; memories?: string; appearance?: string; work?: string; personality?: string; problem?: string; }

export default function ChatPage() {
  const [language] = useState('zh');
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
        setConversationPhase('asking_pool_A_1');
        break;

      case 'asking_pool_A_1':
        const nextQuestionFromB = questionPoolB.pop()!;
        askQuestion(nextQuestionFromB);

        const interactionData = { name: updatedData.name, context: updatedData.meetingContext || updatedData.memories };
        apiClient.post('/api/dynamic-interaction', interactionData)
          .then(response => {
            const dynamicAiResponse: Message = { id: Date.now() + Math.random(), text: response.data.response, sender: 'ai' };
            setPendingAiMessage(dynamicAiResponse);
          })
          .catch(err => console.error("Dynamic interaction failed:", err));

        setConversationPhase('asking_pool_B_1');
        break;

      case 'asking_pool_B_1':
        const lastQuestionFromA = questionPoolA.pop()!;
        askQuestion(lastQuestionFromA);
        setConversationPhase('asking_pool_A_2');
        break;

      case 'asking_pool_A_2':
      case 'asking_pool_B_2':
        if (questionPoolB.length > 0) {
          const nextQuestionFromB_cont = questionPoolB.pop()!;
          askQuestion(nextQuestionFromB_cont);
          setConversationPhase('asking_pool_B_2');
        } else {
          askQuestion(currentContent.problemQuestion);
          setConversationPhase('asking_problem');
        }
        break;

      case 'asking_problem':
        const ackOptions = currentContent.finalAcknowledgement.texts;
        const ackText = ackOptions[Math.floor(Math.random() * ackOptions.length)];
        const finalAiMessage: Message = { id: Date.now() + Math.random(), text: ackText, sender: 'ai' };
        setMessages(prev => [...prev, finalAiMessage]);
        setConversationPhase('awaiting_final_ack');
        break;

      case 'awaiting_final_ack':
        setIsLoading(true);
        try {
          const response = await apiClient.post('/api/generate-story', updatedData);
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
            <Toolbar><Typography variant="h6" component="div" sx={{ color: '#5D4037' }}>你的情感慰藉小屋</Typography></Toolbar>
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
              <TextField fullWidth variant="outlined" placeholder="请输入你的回答..." value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading || storyFinished} />
              <IconButton onClick={handleSend} disabled={isLoading || !currentInput.trim()} sx={{ color: '#ff8a80' }}><SendIcon /></IconButton>
            </Box>
          </Paper>
        </Box>
      )}
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>故事已复制到剪贴板！</Alert>
      </Snackbar>
    </Box>
  );
}