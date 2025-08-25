import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import speciesSlice from './slices/speciesSlice'
import marketplaceSlice from './slices/marketplaceSlice'
import newFeedSlice from './slices/newfeedSlice'
import myPetsSlice from './slices/myPetsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    species: speciesSlice,
    marketplace: marketplaceSlice,
    newfeed: newFeedSlice,
    myPets: myPetsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch