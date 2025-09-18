import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import { stat } from "fs";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    status: "idle",
};

// --- Thunks ---
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (loginData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/login", loginData);
            return response.data; // { accessToken, user }

        } catch (e: any) {
            console.log("hello", e);
            return rejectWithValue(e.response?.data?.message || "Login failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/auth/logout"); // clears cookie server-side
        } catch (e) {
            return rejectWithValue("Logout failed");
        }
    }
);

export const rehydrateAuth = createAsyncThunk(
    "auth/rehydrateAuth",
    async (_, { rejectWithValue }) => {
        try {
            // Calls backend, which reads refresh token from cookie
            const response = await api.post("/auth/refresh-token")
            return response.data; // { accessToken, user }
        } catch (e: any) {
            console.log("ahahhah", e);

            return rejectWithValue("Session expired");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        clearSession: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Login ---
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            })

            // --- Rehydration ---
            .addCase(rehydrateAuth.pending, (state) => {
                state.status = "loading";
            })
            .addCase(rehydrateAuth.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(rehydrateAuth.rejected, (state) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            })

            // --- Logout ---
            .addCase(logoutUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.status = "idle";
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.status = "idle";
            });
    },
});

export const { setAccessToken, clearSession } = authSlice.actions;
export default authSlice.reducer;