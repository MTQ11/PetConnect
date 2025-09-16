import api from "@/lib/api/axios";
import { Pet } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPets = createAsyncThunk(
    'marketplace/getPets',
    async (filters?: {
        specieId?: string;
        breedIds?: string[];
        startPrice?: number;
        endPrice?: number;
        sortBy?: string;
    }) => {
        let url = '/pets';
        const params = new URLSearchParams();

        if (filters?.specieId) params.append('specieId', filters.specieId);
        if (filters?.breedIds && filters.breedIds.length > 0) {
            filters.breedIds.forEach(breedId => params.append('breedIds', breedId));
        }
        if (filters?.startPrice !== undefined) params.append('startPrice', filters.startPrice.toString());
        if (filters?.endPrice !== undefined) params.append('endPrice', filters.endPrice.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await api.get(url);
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