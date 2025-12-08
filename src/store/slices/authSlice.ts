import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../services/api'
import { setAccessToken } from '../../services/token'
import type { ApiResponse, Permission } from '../../types/api'
import type { User } from '../../types/models'
import type { PermissionName, RoleName } from '../../types/permissions'

interface AuthState {
  user: User | null
  accessToken: string | null
  permissions: Permission[]
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
const initialState: AuthState = { user: null, accessToken: null, permissions: [], isAuthenticated: false, isLoading: false, error: null }

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const res = await http.post<any>('/auth/login', payload)
  // Handle both enveloped (res.data.data) and flat (res.data) response structures
  const data = res.data.data || res.data
  return data
})

export const register = createAsyncThunk('auth/register', async (payload: { email: string; password: string; firstName: string; lastName: string }) => {
  const res = await http.post<any>('/auth/register', payload)
  const data = res.data.data || res.data
  return data
})

export const registerStaff = createAsyncThunk('auth/registerStaff', async (payload: { email: string; password: string; firstName: string; lastName: string; roleName: string }) => {
  const res = await http.post<any>('/auth/register-staff', payload)
  const data = res.data.data || res.data
  return data
})

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const res = await http.get<any>('/auth/me')
  const data = res.data.data || res.data
  return data
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
      state.permissions = []
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
       s.permissions = a.payload.permissions || []
       s.isAuthenticated = true
       setAccessToken(a.payload.accessToken)
     })
     .addCase(login.rejected, (s, a) => { s.isLoading = false; s.error = a.error.message ?? 'Login failed' })
     .addCase(register.fulfilled, (s, a) => {
       s.user = a.payload.user
       s.accessToken = a.payload.accessToken
       s.permissions = a.payload.permissions || []
       s.isAuthenticated = true
       setAccessToken(a.payload.accessToken)
     })
     .addCase(registerStaff.fulfilled, (s, a) => {
       // Staff registration doesn't log in the created user
       // Just show success - the created user can log in separately
     })
     .addCase(fetchMe.fulfilled, (s, a) => { 
       s.user = a.payload.user
       s.permissions = a.payload.permissions || []
       s.isAuthenticated = true 
     })
     .addCase(logout.fulfilled, (s) => {
       s.user = null
       s.accessToken = null
       s.permissions = []
       s.isAuthenticated = false
       setAccessToken(null)
     })
  }
})

export const { tokenRefreshed, forceLogout } = slice.actions
export default slice.reducer

// ============================================================================
// Selectors
// ============================================================================

/**
 * Select the current user
 */
export const selectUser = (state: { auth: AuthState }) => state.auth.user

/**
 * Select the user's role name
 */
export const selectUserRole = (state: { auth: AuthState }): RoleName | null => 
  state.auth.user?.role?.name as RoleName ?? null

/**
 * Select all user permissions
 */
export const selectPermissions = (state: { auth: AuthState }) => state.auth.permissions

/**
 * Select authentication status
 */
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated

/**
 * Create a selector factory for checking a specific permission
 * 
 * @example
 * const canCreate = useAppSelector(selectHasPermission('create_patient_records'))
 */
export const selectHasPermission = (permission: PermissionName) => 
  (state: { auth: AuthState }): boolean =>
    state.auth.permissions.some(p => p.name === permission)

/**
 * Create a selector factory for checking if user has ANY of the permissions
 * 
 * @example
 * const canView = useAppSelector(selectHasAnyPermission(['view_all_patients', 'view_assigned_patients']))
 */
export const selectHasAnyPermission = (permissions: PermissionName[]) =>
  (state: { auth: AuthState }): boolean =>
    permissions.some(reqPerm =>
      state.auth.permissions.some(userPerm => userPerm.name === reqPerm)
    )

/**
 * Create a selector factory for checking if user has ALL of the permissions
 * 
 * @example
 * const canManage = useAppSelector(selectHasAllPermissions(['view_lab_orders', 'edit_lab_orders']))
 */
export const selectHasAllPermissions = (permissions: PermissionName[]) =>
  (state: { auth: AuthState }): boolean =>
    permissions.every(reqPerm =>
      state.auth.permissions.some(userPerm => userPerm.name === reqPerm)
    )