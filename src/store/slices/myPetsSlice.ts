import api from "@/lib/api/axios";
import { Pet } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getMyPets = createAsyncThunk(
    "myPets/getMyPets",
    async () => {
        const response = await api.get('/pets/personal')

        if (!(response.status >= 200 && response.status < 300)) {
            throw new Error("Failed to fetch pets");
        }
        const data = await response.data;
        return data;
    }
)

interface MyPetsState {
    myPets: Pet[];
    loading: boolean;
    error: string | null;
}

const initialState: MyPetsState = {
    myPets: [],
    loading: false,
    error: null
}

const myPetsSlice = createSlice({
    name: "myPets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMyPets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyPets.fulfilled, (state, action) => {
                state.loading = false;
                state.myPets = action.payload;
            })
            .addCase(getMyPets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch pets";
            });
    }
});

export const { } = myPetsSlice.actions;
export default myPetsSlice.reducer;