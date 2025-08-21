import api from "@/lib/api/axios";
import { Breeds, Species } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSpecies = createAsyncThunk(
    'species/getSpecies',
    async () => {
        const response = await api.get('/species')

        if (!(response.status >= 200 && response.status < 300)) {
            throw new Error('Failed to fetch species')
        }
        return response.data
    }
)

export const getBreeds = createAsyncThunk(
    'species/getBreeds',
    async (speciesId: string) => {
        const response = await api.get(`/breeds?speciesId=${speciesId}`)
        if (!(response.status >= 200 && response.status < 300)) {
            throw new Error('Failed to fetch breeds')
        }
        return { speciesId, breeds: response.data }
    }
)

interface SpeciesState {
    species: Species[]
    breeds: Record<string, Breeds[]> // Cache breeds by speciesId
    loading: {
        species: boolean
        breeds: Record<string, boolean>
    }
    error: string | null
}

const initialState: SpeciesState = {
    species: [],
    breeds: {},
    loading: {
        species: false,
        breeds: {}
    },
    error: null
}

const speciesSlice = createSlice({
    name: 'species',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Species
            .addCase(getSpecies.pending, (state) => {
                state.loading.species = true
                state.error = null
            })
            .addCase(getSpecies.fulfilled, (state, action) => {
                state.loading.species = false
                state.species = action.payload
            })
            .addCase(getSpecies.rejected, (state, action) => {
                state.loading.species = false
                state.error = action.error.message || 'Failed to fetch species'
            })

            // Breeds
            .addCase(getBreeds.pending, (state, action) => {
                const speciesId = action.meta.arg
                state.loading.breeds[speciesId] = true
            })
            .addCase(getBreeds.fulfilled, (state, action) => {
                const { speciesId, breeds } = action.payload
                state.loading.breeds[speciesId] = false
                state.breeds[speciesId] = breeds
            })
            .addCase(getBreeds.rejected, (state, action) => {
                const speciesId = action.meta.arg
                state.loading.breeds[speciesId] = false
                state.error = action.error.message || 'Failed to fetch breeds'
            })
    }
})

export const { clearError } = speciesSlice.actions
export default speciesSlice.reducer