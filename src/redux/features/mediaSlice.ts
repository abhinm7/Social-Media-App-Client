import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { AxiosError } from "axios";

interface MediaUploadState {
    status: 'idle' | 'loading' | 'failed' | 'succeeded';
    error: string | null;
};

interface ApiErrorResponse {
    message: string;
};

const initialState: MediaUploadState = {
    status: 'idle',
    error: null
};


export const uploadMedia = createAsyncThunk(
    'media/upload',

    async (file: File, { rejectWithValue }) => {
        const formData = new FormData();

        formData.append('file', file)

        try {
            const response = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data;
        }  catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                axiosError.response?.data?.message || "Upload failed"
            );
        }
    } 
);

const MediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadMedia.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadMedia.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(uploadMedia.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
}
)

export default MediaSlice.reducer;