'use client';

import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { LogoutButton } from '@/components/LogoutButton';
import { useThemeContext } from '@/context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/rootReducer';
import Link from 'next/link';
import { LockOutline, PowerSettingsNew } from '@mui/icons-material';

export default function Navbar() {
    const { toggleTheme, mode } = useThemeContext();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <Typography variant="h4" component={Link} href="/" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold', fontFamily: 'var(--font-bitcount)' }}>
                    BLOOM
                </Typography>

                {isAuthenticated ? (
                    <PowerSettingsNew />
                ) : (
                    <Button color="inherit" component={Link} href="/login">
                        <LockOutline/>
                    </Button>
                )}

                <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}