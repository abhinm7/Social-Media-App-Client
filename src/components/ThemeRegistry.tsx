'use client';

import { useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark');

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            ...(mode === 'dark'
                ? { primary: { main: '#a5d6a7' }, background: { default: '#121212', paper: '#000000' } }
                : { primary: { main: '#EC7FA9' }, background: { default: '#FFB8E0', paper: '#FFEDFA' } }),
        },
    }), [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeProvider theme={theme}>
            {/* The Box provides a positioning context for the icon */}
            <Box sx={{ position: 'relative', backgroundColor: 'background.default', color: 'text.primary' }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
                {children}
            </Box>
        </ThemeProvider>
    );
}