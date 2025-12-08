import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, Alert } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store'
import { login } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const schema = z.object({ email: z.string().email(), password: z.string().min(8) })
type FormData = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const toast = useToast()
  const { isLoading, error } = useAppSelector(s => s.auth)

  const onSubmit = async (data: FormData) => {
    console.log('Login submitted', data)
    try {
      const res = await dispatch(login(data))
      console.log('Login response', res)

      if (login.fulfilled.match(res)) {
        console.log('Login fulfilled', res.payload)
        toast.success(`Welcome back, ${res.payload.user.firstName}!`)
        // Navigate to dashboard - the role-specific route is optional
        nav('/dashboard')
      } else if (login.rejected.match(res)) {
        console.error('Login rejected', res.error)
        // Error handling is now enhanced by the interceptor, but we can still show specific form errors here if needed
        // The global interceptor shows toasts for 429, 500, etc.
        // For 401 on login, we might want to show a form error instead of a toast
        const errorMsg = res.error.message || 'Login failed'
        if (errorMsg.includes('429')) {
          // Already handled by toast
        } else if (errorMsg.includes('401') || errorMsg.includes('400')) {
          // Invalid credentials
        }
        // We rely on the slice error state which is updated by the rejected action
      }
    } catch (err) {
      console.error('Login error caught in component', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Stack>
    </form>
  )
}