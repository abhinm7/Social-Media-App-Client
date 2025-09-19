'use client';

import { useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, IconButton, CssBaseline } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '@/context/ThemeContext'; // 👈 1. Import the context

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark');

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            ...(mode === 'dark'
                ? { primary: { main: '#EC7FA9' }, background: { default: '#121212', paper: '#000000' } }
                : { primary: { main: '#EC7FA9' }, background: { default: '#FFB8E0', paper: '#FFEDFA' } }),
        },
    }), [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // This is the value that will be shared with other components
    const contextValue = { toggleTheme, mode };

    return (
        // 👇 2. Wrap everything with the context provider
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Helps apply background color and reset styles */}
                {/* We can remove the icon from here, since it will be in the Navbar */}
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}