'use client'

import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/features/authSlice";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";
import toast from 'react-hot-toast';
import AuthLayout from "@/components/layouts/AuthLayout"; // Import the layout
import { Button, TextField, Typography, Box, CircularProgress, Link } from "@mui/material";

export default function LoginPage() {
    const [email, setEmail] = useState('');
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
        const toastId = toast.loading('Logging in...');
        const resultAction = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(resultAction)) {
            toast.success('Welcome back!', { id: toastId });
        } else {
            const errorMessage = resultAction.payload as string || 'Login failed.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <AuthLayout subtitle="Welcome back! Please sign in.">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                    margin="dense"
                    size="small"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.8rem' }, required: false }}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.8rem' }, required: false }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="medium"
                    disableElevation
                    sx={{ mt: 2, mb: 2, borderRadius: 2, fontWeight: 'bold' }}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
                <Typography variant="caption" align="center" component="p">
                    <Link href="/register" underline="hover" sx={{ color: 'primary.light', fontWeight: 'bold' }}>
                        Don&apos;t have an account? Sign Up
                    </Link>
                </Typography>
            </Box>
        </AuthLayout>
    );
}