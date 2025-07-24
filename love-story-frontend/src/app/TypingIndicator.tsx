// src/app/TypingIndicator.tsx

'use client';

import React from 'react';
import { Box } from '@mui/material';

export default function TypingIndicator() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: '6px 8px' }}>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
        </Box>
    );
}