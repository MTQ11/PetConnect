import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import speciesSlice from './slices/speciesSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    species: speciesSlice,
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