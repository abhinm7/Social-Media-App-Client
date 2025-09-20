import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface MediaUploadState {
    status: 'idle' | 'loading' | 'failed' | 'succeeded';
    error: string | null;
};

const initialState: MediaUploadState = {
    status: 'idle',
    error: null
};

export const uploadMedia = createAsyncThunk(
    'media/upload',
    async (files: File[], { rejectWithValue }) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('media', file);
        });

        try {
            const response = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data.media;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "upload failed")
        }
    }
);

const MediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder
        .addCase(uploadMedia.pending,(state)=>{
            state.status = 'loading';
        })
        .addCase(uploadMedia.fulfilled,(state)=>{
            state.status='succeeded';
        })
        .addCase(uploadMedia.rejected,(state,action)=>{
            state.status='failed';
            state.error = action.payload as string;
        })
    }
}
)

export default MediaSlice.reducer;