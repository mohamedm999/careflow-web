import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../services/api'
import { setAccessToken } from '../../services/token'
import type { ApiResponse } from '../../types/api'

interface Role { id: string; name: string; permissions: { id: string; name: string }[] }
interface User { id: string; email: string; firstName: string; lastName: string; role: Role; isActive: boolean }
interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
const initialState: AuthState = { user: null, accessToken: null, isAuthenticated: false, isLoading: false, error: null }

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const res = await http.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', payload)
  return res.data.data!
})

export const register = createAsyncThunk('auth/register', async (payload: { email: string; password: string; firstName: string; lastName: string }) => {
  const res = await http.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', payload)
  return res.data.data!
})

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const res = await http.get<ApiResponse<User>>('/auth/me')
  return res.data.data!
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await http.post('/auth/logout')
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isAuthenticated = !!action.payload
    },
    forceLogout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      setAccessToken(null)
    }
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.isLoading = true; s.error = null })
     .addCase(login.fulfilled, (s, a) => {
       s.isLoading = false
       s.user = a.payload.user
       s.accessToken = a.payload.accessToken
       s.isAuthenticated = true
       setAccessToken(a.payload.accessToken)
     })
     .addCase(login.rejected, (s, a) => { s.isLoading = false; s.error = a.error.message ?? 'Login failed' })
     .addCase(register.fulfilled, (s, a) => {
       s.user = a.payload.user
       s.accessToken = a.payload.accessToken
       s.isAuthenticated = true
       setAccessToken(a.payload.accessToken)
     })
     .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.isAuthenticated = true })
     .addCase(logout.fulfilled, (s) => {
       s.user = null
       s.accessToken = null
       s.isAuthenticated = false
       setAccessToken(null)
     })
  }
})

export const { tokenRefreshed, forceLogout } = slice.actions
export default slice.reducer