'use client'

import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "@/redux/features/authSlice";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";

// Material-UI Imports
import { 
    Button,
    TextField, 
    Typography, 
    Container, 
    Box,
    CircularProgress,
    Paper,
    Link
} from "@mui/material";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
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
        const resultAction = await dispatch(registerUser({ username, email, password }));

        if (!registerUser.fulfilled.match(resultAction)) {
            alert('Registration failed. Please try again.');
        }
    }

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5', // Clean, light gray background
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper 
                    elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 3,
                        minHeight: 445, // Set for the 3:4 aspect ratio
                        justifyContent: 'center',
                        borderRadius: 4,
                    }}
                >
                    <Typography component="h1" variant="h6" sx={{ mb: 0.5, fontWeight: 'bold', color: '#1565c0' }}>
                        Bloom
                    </Typography>
                    <Typography component="h2" variant="caption" sx={{ mb: 2, color: 'text.secondary' }}>
                        Create your account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="dense"
                            size="small"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="dense"
                            size="small"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                            {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                        </Button>
                        <Typography variant="caption" align="center" component="p">
                            <Link href="/login" underline="hover" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                                Already have an account? Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}