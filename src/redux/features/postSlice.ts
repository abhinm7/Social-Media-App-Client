import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/lib/api';
import { Post } from "@/types";
import { AxiosError } from "axios";

interface PostState {
    posts: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    page: number;
    hasMore: boolean;
    totalPosts: number;
    error?: string;
}

interface ApiErrorResponse {
    message: string;
}

const initialState: PostState = {
    posts: [],
    status: 'idle',
    createStatus: 'idle', page: 1,
    totalPosts: 0,
    hasMore: true,
};

export const fetchPosts = createAsyncThunk<
    { posts: Post[]; totalPosts: number },
    { page: number },
    { rejectValue: string }
>(
    'post/fetchPosts',
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/posts/all-posts?page=${page}`);
            return {
                posts: response.data.populatedPosts,
                totalPosts: response.data.totalPosts,
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                axiosError.response?.data?.message || "Failed to fetch posts"
            );
        }
    }
);

export const createPost = createAsyncThunk(
    'post/createPost',
    async (postData: { content: string, mediaIDs: string[] }, { rejectWithValue }) => {
        try {
            const response = await api.post('/posts/create-post', postData);
            return response.data.post;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                axiosError.response?.data?.message || "Failed to create post"
            );
        }
    }
);

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        resetPosts: (state) => {
            state.posts = [];
            state.page = 1;
            state.hasMore = true;
            state.totalPosts = 0;
            state.status = "idle";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = [...state.posts, ...action.payload.posts]
                state.totalPosts = action.payload.totalPosts;
                state.page += 1;
                state.hasMore = state.posts.length < state.totalPosts;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload
            })
            .addCase(createPost.pending, (state) => { state.createStatus = 'loading'; })
            .addCase(createPost.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                if (action.payload && action.payload._id) {
                    state.posts.unshift(action.payload);
                }
            })
            .addCase(createPost.rejected, (state, action) => {
                state.createStatus = 'failed';
                // state.error = action.payload;
            });
    },
});

export const {resetPosts} = postSlice.actions;
export default postSlice.reducer;