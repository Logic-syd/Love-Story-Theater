// src/app/LoadingState.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';

// 一系列动态变化的、充满希望的提示语
// const loadingMessages = [
//     '正在连接梦境的彼岸...',
//     '我看到了你们在阳光下散步的画面...',
//     '正在为你编织一个温暖的拥抱...',
//     '别急，美好的事物总需要一点点酝酿...',
//     '我听到了他未来的心跳声，很稳，很安心...',
//     '未来的画卷正在缓缓展开...',
//     '再一下下，这个充满希望的梦就要完成了。'
// ];

export default function LoadingState({ messages }: { messages: string[] }) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // 使用 useEffect 和 setInterval 来定时切换提示语
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 4000); // 每4秒切换一次

        // 组件卸载时，清除定时器，防止内存泄漏
        return () => clearInterval(intervalId);
    }, [messages]);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 240, 245, 0.9)', // 淡粉色半透明背景
                zIndex: 9999,
                overflow: 'hidden', // 隐藏溢出的花瓣
            }}
        >
            {/* 这是花瓣雨的容器 */}
            <div className="petals">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="petal"></div>
                ))}
            </div>

            {/* 动态变化的提示语，使用Fade组件增加淡入淡出效果 */}
            <Fade in={true} timeout={1500}>
                <Typography variant="h6" sx={{ color: '#5D4037', zIndex: 1 }}>
                    {messages[currentMessageIndex]}
                </Typography>
            </Fade>
        </Box>
    );
}   