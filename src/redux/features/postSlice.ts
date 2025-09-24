import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/lib/api';
import { Post } from "@/types";

interface PostState {
    posts: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PostState = {
    posts: [],
    status: 'idle',
    createStatus: 'idle',
};

export const fetchPosts = createAsyncThunk<Post[]>(
    'post/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/posts/all-posts');
            return response.data.populatedPosts;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch posts");
        }
    }
);

export const createPost = createAsyncThunk(
    'post/createPost',
    async (postData: { content: string, mediaIDs: string[] }, { rejectWithValue }) => {
        try {
            const response = await api.post('/posts/create-post', postData);
            return response.data.post;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to create post");
        }
    }
);

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state) => { state.status = 'failed'; })

            .addCase(createPost.pending, (state) => { state.createStatus = 'loading'; })
            .addCase(createPost.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state) => { state.createStatus = 'failed'; });
    },
});

export default postSlice.reducer;