'use client'

import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/features/authSlice";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";

// Material-UI component imports (we'll install these below)
import { 
    Button, 
    Card, 
    CardContent, 
    TextField, 
    Typography, 
    Container, 
    Box,
    CircularProgress 
} from "@mui/material";

export default function LoginPage() {
    const [email, setEmail] = useState('bro@gmail.com');
    const [password, setPassword] = useState('bro3bro3');

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
        const resultAction = await dispatch(loginUser({ email, password }));
        if (!loginUser.fulfilled.match(resultAction)) {
            alert('Login failed. Please check your credentials.');
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Card sx={{ width: '100%', padding: 2 }}>
                    <CardContent>
                        <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
                            Login
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}