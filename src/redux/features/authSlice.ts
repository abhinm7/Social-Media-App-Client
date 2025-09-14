import { api } from "@/lib/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    status: 'idle',
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData: any, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/login`, loginData);
            return response.data;
        } catch (e: any) {
            console.log("login failed",e);

            return rejectWithValue(e.response.data.message || 'Login failed')
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await api.post(`/auth/logout`)
        } catch (e) {
            console.log("Failed to remove refresh token from server, logging out on client.", e);
            return rejectWithValue(e || 'Login failed')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //login cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.isAuthenticated = true
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
            }).addCase(loginUser.rejected, (state, action) => {
                state.isAuthenticated = false
                state.status = 'failed'
                state.accessToken = null
                state.user = null
            })

            //Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.status = 'idle';
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.status = 'idle';
            });
    }
})

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;