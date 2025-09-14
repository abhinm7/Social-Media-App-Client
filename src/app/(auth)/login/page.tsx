'use client'

import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/features/authSlice";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { status } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(resultAction)) {
            router.push('/home');
        } else {
            alert('login failed');
        }
    }

    return (
        <div>
            <h1>Login to Your App</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}