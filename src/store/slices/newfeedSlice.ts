import api from "@/lib/api/axios";
import { Post } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk(
    "newfeed/getAllPost",
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
        const response = await api.get(`/posts?page=${page}&limit=${limit}`)
        return response.data
    }
)

export const loadMorePosts = createAsyncThunk(
    "newfeed/loadMorePosts", 
    async ({ page, limit = 10 }: { page: number; limit?: number }) => {
        const response = await api.get(`/posts?page=${page}&limit=${limit}`)
        return response.data
    }
)

export const updatePost = createAsyncThunk(
    "newfeed/updatePost",
    async ({ id, data }: { id: string; data: { content?: string; imageUrl?: string; location?: string } }) => {
        const response = await api.put(`/posts/${id}`, data)
        return response.data
    }
)

export const deletePost = createAsyncThunk(
    "newfeed/deletePost",
    async (id: string) => {
        await api.delete(`/posts/${id}`)
        return id
    }
)

interface NewFeedState {
    posts: Post[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    currentPage: number;
    hasMore: boolean;
    totalPages: number;
    loadingMore: boolean;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: NewFeedState = {
    posts: [],
    status: "idle",
    error: null,
    currentPage: 1,
    hasMore: true,
    totalPages: 1,
    loadingMore: false,
    updateStatus: "idle",
    deleteStatus: "idle"
}

const newFeedSlice = createSlice({
    name: "newfeed",
    initialState,
    reducers: {
        resetPosts: (state) => {
            state.posts = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.status = "idle";
            state.error = null;
        },
        addNewPost: (state, action) => {
            state.posts.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPost.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getAllPost.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.posts = action.payload.posts
                state.currentPage = action.payload.currentPage
                state.hasMore = action.payload.hasMore
                state.totalPages = action.payload.totalPages
            })
            .addCase(getAllPost.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message || 'Failed to fetch posts'
            })
            .addCase(loadMorePosts.pending, (state) => {
                state.loadingMore = true
                state.error = null
            })
            .addCase(loadMorePosts.fulfilled, (state, action) => {
                state.loadingMore = false
                state.posts = [...state.posts, ...action.payload.posts]
                state.currentPage = action.payload.currentPage
                state.hasMore = action.payload.hasMore
                state.totalPages = action.payload.totalPages
            })
            .addCase(loadMorePosts.rejected, (state, action) => {
                state.loadingMore = false
                state.error = action.error.message || 'Failed to load more posts'
            })
            .addCase(updatePost.pending, (state) => {
                state.updateStatus = "loading"
                state.error = null
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.updateStatus = "succeeded"
                const updatedPost = action.payload
                const index = state.posts.findIndex(post => post.id === updatedPost.id)
                if (index !== -1) {
                    state.posts[index] = updatedPost
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.updateStatus = "failed"
                state.error = action.error.message || 'Failed to update post'
            })
            .addCase(deletePost.pending, (state) => {
                state.deleteStatus = "loading"
                state.error = null
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded"
                const deletedPostId = action.payload
                state.posts = state.posts.filter(post => post.id !== deletedPostId)
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.deleteStatus = "failed"
                state.error = action.error.message || 'Failed to delete post'
            })
    }
})

export const { resetPosts, addNewPost } = newFeedSlice.actions
export default newFeedSlice.reducer