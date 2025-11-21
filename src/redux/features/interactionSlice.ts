import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '@/lib/api';
import { AxiosError } from "axios";
import { RootState } from "@/redux/store"; 

interface ApiErrorResponse {
    message: string;
}

export const toggleLikePost = createAsyncThunk(
    'interaction/toggleLike',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            return { postId, isLiked: response.data.isLiked, likeCount: response.data.likeCount };
        } catch (error) {
             const axiosError = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(axiosError.response?.data?.message || "Failed to like post");
        }
    }
);

export const fetchComments = createAsyncThunk(
    'interaction/fetchComments',
    async ({ postId, page }: { postId: string, page: number }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/posts/${postId}/comments?page=${page}`);
            return { postId, comments: response.data.comments, page, totalComments: response.data.totalComments };
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch comments");
        }
    }
);

export const addCommentPost = createAsyncThunk(
    'interaction/addComment',
    async ({ postId, content }: { postId: string, content: string }, { rejectWithValue, getState }) => {
        try {
            const response = await api.post(`/posts/${postId}/comment`, { content });
            const newComment = response.data.comment;

            // get the real user object from our local Auth state to populate it immediately.
            const state = getState() as RootState;
            const currentUser = state.auth.user; 

            const populatedComment = {
                ...newComment,
                user: currentUser || { _id: newComment.user, username: 'You' } 
            };

            return { postId, comment: populatedComment }; 
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(axiosError.response?.data?.message || "Failed to add comment");
        }
    }
);

const interactionSlice = createSlice({
    name: 'interaction',
    initialState: {}, 
    reducers: {}
});

export default interactionSlice.reducer;