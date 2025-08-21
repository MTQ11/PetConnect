import api from "@/lib/api/axios";
import { User } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string, password: string, rememberMe: boolean }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);

            if (!(response.status >= 200 && response.status < 300)) {
                return rejectWithValue({ error: response.data?.message || 'Đăng nhập thất bại' });
            }

            const storage = credentials.rememberMe ? localStorage : sessionStorage;
            storage.setItem('accessToken', response.data.access_token);
            if (response.data.refresh_token) {
                storage.setItem('refreshToken', response.data.refresh_token);
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue({ error: error?.message || 'Đăng nhập thất bại' });
        }
    }
)

export const loginZaloUser = createAsyncThunk(
    'auth/loginZalo',
    async () => {
        
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')

        await api.post('/auth/logout');
    }
)

export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');

            if (!(response.status >= 200 && response.status < 300)) {
                return rejectWithValue({ error: response.data?.message || 'Failed to fetch user data' });
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue({ error: error?.message || 'Failed to fetch user data' });
        }
    }
)

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    token: string | null
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state: AuthState) => {
            state.error = null
        },
        updateUser: (state: AuthState, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        }
    },
    extraReducers: (builder: any) => {
        builder
            //login
            .addCase(loginUser.pending, (state: AuthState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
            })
            .addCase(loginUser.rejected, (state: AuthState, action: any) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload?.error || action.error?.message || 'Đăng nhập thất bại';
            })

            //logout
            .addCase(logoutUser.fulfilled, (state: AuthState) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            })

            //checkAuthStatus
            .addCase(checkAuthStatus.pending, (state: AuthState) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state: AuthState, action: any) => {
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = action.payload?.error || action.error?.message || 'Failed to fetch user data';
            });
    }
})

export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer