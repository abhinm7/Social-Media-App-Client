'use client';

import { useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeContext } from '@/context/ThemeContext';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            ...(mode === 'dark'
                ? {
                    primary: { main: '#EC7FA9' },
                    background: { default: '#121212', paper: '#000000' },
                    nav: { logo: '#FFFFFF', bg: '#121212' },
                    comment: {
                        bg: '#1A1A1A',
                        border: '#444',
                        borderHover: '#666',
                        borderFocus: '#EC7FA9',
                        text: '#FFFFFF',
                        avatar: '#EC7FA9',
                        secondary: '#D2D2D2',
                        inputBg: '##2C2C2C',
                    }
                }
                : {
                    primary: { main: '#8F00FF' },
                    background: { default: '#FFFFFF', paper: '#FFFFFF' },
                    nav: { logo: '#8F00FF', bg: '#FFFFFF' },
                    comment: {
                        bg: '#FAFAFA',
                        border: '#D2D2D2',
                        borderHover: '#dee2e6',
                        borderFocus: '#dee2e6',
                        text: '#000000',
                        avatar: '#8F00FF',
                        secondary: '#A9A9A9',
                        inputBg: '#FFFFFF',
                    }
                }),
        },
    }), [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const contextValue = { toggleTheme, mode };

    return (
            <ThemeContext.Provider value={contextValue}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ThemeContext.Provider>
    );
}