import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getSpecies, getBreeds } from '@/store/slices/speciesSlice'

export function useSpeciesData() {
    const dispatch = useAppDispatch()
    const { species, loading } = useAppSelector(state => state.species)

    useEffect(() => {
        if (species.length === 0 && !loading.species) {
            dispatch(getSpecies())
        }
    }, [dispatch, species.length, loading.species])

    return { 
        species, 
        loading: loading.species,
        refetch: () => dispatch(getSpecies())
    }
}

export function useBreedsData(speciesId?: string) {
    const dispatch = useAppDispatch()
    const { breeds, loading } = useAppSelector(state => state.species)

    const currentBreeds = speciesId ? breeds[speciesId] || [] : []
    const isLoading = speciesId ? loading.breeds[speciesId] || false : false

    useEffect(() => {
        if (speciesId && !breeds[speciesId] && !loading.breeds[speciesId]) {
            dispatch(getBreeds(speciesId))
        }
    }, [speciesId, breeds, loading.breeds, dispatch])

    return { 
        breeds: currentBreeds, 
        loading: isLoading,
        hasData: speciesId ? !!breeds[speciesId] : false
    }
}
