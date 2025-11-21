import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/lib/api';
import { Post } from "@/types";
import { AxiosError } from "axios";
import { toggleLikePost, fetchComments, addCommentPost } from './interactionSlice';

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
    createStatus: 'idle',
    page: 1,
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
            return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch posts");
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
            return rejectWithValue(axiosError.response?.data?.message || "Failed to create post");
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
            // --- Main Feed Logic ---
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Initialize interaction state for new posts
                const newPosts = action.payload.posts.map(p => ({
                    ...p,
                    loadedComments: [],
                    commentsPage: 0,
                    areCommentsLoading: false
                }));
                state.posts = [...state.posts, ...newPosts];
                state.totalPosts = action.payload.totalPosts;
                state.page += 1;
                state.hasMore = state.posts.length < state.totalPosts;
            })

            .addCase(createPost.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                if (action.payload && action.payload._id) {
                    // Add new post to top of feed with initialized interaction state
                    state.posts.unshift({
                        ...action.payload,
                        loadedComments: [],
                        commentsPage: 0
                    });
                }
            })

            // --- Interaction Logic (Listening to interactionSlice) ---
            .addCase(toggleLikePost.pending, (state, action) => {
                // action.meta.arg contains the postId passed to the thunk
                const post = state.posts.find(p => p._id === action.meta.arg);
                if (post) {
                    // Flip the boolean immediately
                    const wasLiked = post.isLiked;
                    post.isLiked = !wasLiked;

                    // We use Math.max to ensure count never goes below 0
                    post.likeCount = wasLiked ? Math.max(0, post.likeCount - 1) : post.likeCount + 1;
                }
            })

            // Sync with server truth when done 
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.payload.postId);
                if (post) {
                    post.isLiked = action.payload.isLiked;
                    post.likeCount = action.payload.likeCount;
                }
            })

            // Rollback if server fails
            .addCase(toggleLikePost.rejected, (state, action) => {
                const post = state.posts.find(p => p._id === action.meta.arg);
                if (post) {
                    // Revert changes because the API call failed
                    const wasLiked = post.isLiked;
                    post.isLiked = !wasLiked;
                    post.likeCount = wasLiked ? Math.max(0, post.likeCount - 1) : post.likeCount + 1;
                }
            })

            .addCase(fetchComments.pending, (state, action) => {
                const post = state.posts.find(p => p._id === action.meta.arg.postId);
                if (post) {
                    post.areCommentsLoading = true;
                }
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.payload.postId);
                if (post) {
                    post.areCommentsLoading = false;
                    post.commentsPage = action.payload.page;

                    // Overwrite if page 1, otherwise append for infinite scroll
                    if (action.payload.page === 1) {
                        post.loadedComments = action.payload.comments;
                    } else {
                        post.loadedComments = [...(post.loadedComments || []), ...action.payload.comments];
                    }
                }
            })

            .addCase(addCommentPost.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.payload.postId);
                if (post) {
                    post.commentCount += 1;
                    // Optimistically add new comment to the top of the list
                    if (post.loadedComments) {
                        post.loadedComments.unshift(action.payload.comment);
                    } else {
                        post.loadedComments = [action.payload.comment];
                    }
                }
            });
    },
});

export const { resetPosts } = postSlice.actions;
export default postSlice.reducer;