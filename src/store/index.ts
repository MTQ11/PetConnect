import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import speciesSlice from './slices/speciesSlice'
import marketplaceSlice from './slices/marketplaceSlice'
import newFeedSlice from './slices/newfeedSlice'
import myPetsSlice from './slices/myPetsSlice'
import userSiteSlice from './slices/userSiteSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    species: speciesSlice,
    marketplace: marketplaceSlice,
    newfeed: newFeedSlice,
    myPets: myPetsSlice,
    userSite: userSiteSlice
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