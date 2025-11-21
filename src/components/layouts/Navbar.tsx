'use client';

import { AppBar, Toolbar, Typography, Button, IconButton, alpha } from '@mui/material';
import { LogoutButton } from '@/components/LogoutButton';
import { useThemeContext } from '@/context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/rootReducer';
import Link from 'next/link';
import { LockOutline } from '@mui/icons-material';

export default function Navbar() {
    const { toggleTheme, mode } = useThemeContext();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <AppBar position="sticky" sx={{
                backgroundColor: (theme) => alpha(theme.palette.nav.bg, 0.8),

                backdropFilter: 'blur(8px)',

                borderBottom: (theme) => `1px dotted ${alpha(theme.palette.divider, 0.12)}`,
            }} elevation={0}>
            <Toolbar>
                <Typography variant="h4" component={Link} href="/" sx={{ flexGrow: 1, color: 'nav.logo', fontWeight: 'bold', fontFamily: 'var(--font-bitcount)' }}>
                    BLOOM
                </Typography>

                {isAuthenticated ? (
                    <LogoutButton />
                ) : (
                    <Button color="primary" component={Link} href="/login">
                        <LockOutline/>
                    </Button>
                )}

                <IconButton color="primary" onClick={toggleTheme} sx={{ ml: 1 }}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}