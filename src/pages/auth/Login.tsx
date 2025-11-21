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
    const res = await dispatch(login(data))
    if (login.fulfilled.match(res)) {
      toast.success('Login successful!')
      nav('/dashboard')
    } else if (login.rejected.match(res)) {
      toast.error(res.error.message || 'Login failed')
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