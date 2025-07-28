// src/app/LanguageSwitcher.tsx

'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

// Define the props the component will accept
interface LanguageSwitcherProps {
    language: string;
    setLanguage: (language: string) => void;
}

// Define the available languages
const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
];

export default function LanguageSwitcher({ language, setLanguage }: LanguageSwitcherProps) {
    // State to manage the menu's anchor element (where it appears)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        handleClose();
    };

    return (
        <div>
            <IconButton
                onClick={handleClick}
                color="inherit" // Inherits the color from the AppBar
            >
                <TranslateIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        selected={lang.code === language}
                        onClick={() => handleLanguageChange(lang.code)}
                    >
                        {lang.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}