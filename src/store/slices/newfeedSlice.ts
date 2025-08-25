import api from "@/lib/api/axios";
import { Post } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk(
    "newfeed/getAllPost",
    async () => {
        const response = await api.get("/posts")
        return response.data
    }
)

interface NewFeedState {
    posts: Post[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: NewFeedState = {
    posts: [],
    status: "idle",
    error: null
}

const newFeedSlice = createSlice({
    name: "newfeed",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllPost.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getAllPost.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.posts = action.payload
            })
            .addCase(getAllPost.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message || 'Failed to fetch posts'
            })
    }
})


export const {  } = newFeedSlice.actions
export default newFeedSlice.reducer