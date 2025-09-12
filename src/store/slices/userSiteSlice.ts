import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api/axios';
import { 
  LayoutConfig, 
  HeaderSection, 
  HeroSection, 
  PetListSection, 
  AboutSection, 
  FooterSection,
  SectionType 
} from '@/types';

// Async thunk để fetch layout config
export const fetchUserSiteLayoutConfig = createAsyncThunk(
  'userSite/fetchLayoutConfig',
  async (breederId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user-site/${breederId}/layout-config`);
      return response.data.layoutConfig;
    } catch (error: any) {
      console.error('Error fetching layout config:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch layout config');
    }
  }
);

// Interface cho state
interface UserSiteState {
  layoutConfig: LayoutConfig | null;
  headerConfig: HeaderSection | null;
  heroConfig: HeroSection | null;
  petlistConfig: PetListSection | null;
  aboutConfig: AboutSection | null;
  footerConfig: FooterSection | null;
  loading: boolean;
  error: string | null;
  breederId: string | null;
}

// Initial state
const initialState: UserSiteState = {
  layoutConfig: null,
  headerConfig: null,
  heroConfig: null,
  petlistConfig: null,
  aboutConfig: null,
  footerConfig: null,
  loading: false,
  error: null,
  breederId: null,
};

// Helper function để extract sections từ layout config
const extractSections = (layoutConfig: LayoutConfig) => {
  return {
    headerConfig: layoutConfig.sections.find((section: any) => section.type === SectionType.HEADER) as HeaderSection || null,
    heroConfig: layoutConfig.sections.find((section: any) => section.type === SectionType.HERO) as HeroSection || null,
    petlistConfig: layoutConfig.sections.find((section: any) => section.type === SectionType.PET_LIST) as PetListSection || null,
    aboutConfig: layoutConfig.sections.find((section: any) => section.type === SectionType.ABOUT) as AboutSection || null,
    footerConfig: layoutConfig.sections.find((section: any) => section.type === SectionType.FOOTER) as FooterSection || null,
  };
};

// Slice
const userSiteSlice = createSlice({
  name: 'userSite',
  initialState,
  reducers: {
    // Reset state
    resetUserSite: (state) => {
      return initialState;
    },
    
    // Set breeder ID
    setBreederId: (state, action: PayloadAction<string>) => {
      state.breederId = action.payload;
    },
    
    // Update individual section configs
    updateHeaderConfig: (state, action: PayloadAction<HeaderSection>) => {
      state.headerConfig = action.payload;
    },
    
    updateHeroConfig: (state, action: PayloadAction<HeroSection>) => {
      state.heroConfig = action.payload;
    },
    
    updatePetlistConfig: (state, action: PayloadAction<PetListSection>) => {
      state.petlistConfig = action.payload;
    },
    
    updateAboutConfig: (state, action: PayloadAction<AboutSection>) => {
      state.aboutConfig = action.payload;
    },
    
    updateFooterConfig: (state, action: PayloadAction<FooterSection>) => {
      state.footerConfig = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserSiteLayoutConfig
      .addCase(fetchUserSiteLayoutConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSiteLayoutConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.layoutConfig = action.payload;
        
        // Extract individual section configs
        const sections = extractSections(action.payload);
        state.headerConfig = sections.headerConfig;
        state.heroConfig = sections.heroConfig;
        state.petlistConfig = sections.petlistConfig;
        state.aboutConfig = sections.aboutConfig;
        state.footerConfig = sections.footerConfig;
      })
      .addCase(fetchUserSiteLayoutConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  resetUserSite,
  setBreederId,
  updateHeaderConfig,
  updateHeroConfig,
  updatePetlistConfig,
  updateAboutConfig,
  updateFooterConfig,
  clearError,
} = userSiteSlice.actions;

// Export reducer
export default userSiteSlice.reducer;