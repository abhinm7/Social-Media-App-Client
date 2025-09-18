'use client'

import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/features/authSlice"; // Use the loginUser action
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";

// Material-UI Imports
import { 
    Button,
    TextField, 
    Typography,
    Box,
    CircularProgress,
    Paper,
    Link
} from "@mui/material";

export default function LoginPage() {
    const [email, setEmail]= useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { status, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email, password })); // Dispatch loginUser

        if (!loginUser.fulfilled.match(resultAction)) {
            alert('Login failed. Please check your credentials.');
        }
    }

    return (
        <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper 
                elevation={3}
                sx={{
                    maxWidth: '380px', 
                    minHeight: '420px', 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 4,
                }}
            >
                <Typography component="h1" variant="h6" sx={{ mb: 0.5, fontWeight: 'bold', color: '#1565c0' }}>
                    Bloom
                </Typography>
                <Typography component="h2" variant="caption" sx={{ mb: 2, color: 'text.secondary' }}>
                    Welcome back! Please sign in.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="dense"
                        size="small"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                        margin="dense"
                        size="small"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ '& .MMuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="medium"
                        disableElevation
                        sx={{ 
                            mt: 2, 
                            mb: 2, 
                            borderRadius: 2,
                            backgroundColor: '#42a5f5',
                            '&:hover': {
                                backgroundColor: '#1e88e5'
                            }
                        }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                    <Typography variant="caption" align="center" component="p">
                        <Link href="/register" underline="hover" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                            Don't have an account? Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}