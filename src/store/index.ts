import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import speciesSlice from './slices/speciesSlice'
import marketplaceSlice from './slices/marketplaceSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    species: speciesSlice,
    marketplace: marketplaceSlice,
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