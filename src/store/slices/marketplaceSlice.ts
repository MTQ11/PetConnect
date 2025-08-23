import api from "@/lib/api/axios";
import { Pet } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPets = createAsyncThunk(
    'marketplace/getPets',
    async () => {
        const response = await api.get('/pets');
        return response.data;
    }
)

interface MarketplaceState {
    pets: Pet[];
    isLoading: boolean;
    error: string | null;
}

const initialState: MarketplaceState = {
    pets: [],
    isLoading: false,
    error: null
};

const marketplaceSlice = createSlice({
    name: "marketplace",
    initialState,
    reducers: {
        fetchPetsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchPetsSuccess(state, action) {
            state.isLoading = false;
            state.pets = action.payload;
        },
        fetchPetsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        updatePetLike(state, action) {
            const { petId, isLiked } = action.payload;
            const pet = state.pets.find(p => p.id === petId);
            if (pet) {
                pet.isLiked = !isLiked;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pets = action.payload;
            })
            .addCase(getPets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || "Failed to fetch pets";
            });
    }
});

export const { fetchPetsStart, fetchPetsSuccess, fetchPetsFailure, updatePetLike } = marketplaceSlice.actions;

export default marketplaceSlice.reducer;