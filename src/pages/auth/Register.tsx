import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, Alert, Typography } from '@mui/material'
import { useAppDispatch } from '../../store'
import { register as registerAction } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[a-zA-Z]+$/, 'First name must contain only letters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters')
})
type FormData = z.infer<typeof schema>

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      const res = await dispatch(registerAction(data))
      if (registerAction.fulfilled.match(res)) {
        toast.success('Registration successful! Welcome to CareFlow.')
        nav('/dashboard')
      } else if (registerAction.rejected.match(res)) {
        const errorMsg = (res.payload as any)?.message || res.error?.message || 'Registration failed'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Registration failed. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Typography variant="h5" gutterBottom>
          Create Patient Account
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Alert severity="info">
          <strong>Password Requirements:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>
        </Alert>

        <TextField
          label="First Name"
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          disabled={isSubmitting}
        />
        <TextField
          label="Last Name"
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          disabled={isSubmitting}
        />
        <TextField
          label="Email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isSubmitting}
        />
        <TextField
          label="Password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          size="large"
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </Button>
      </Stack>
    </form>
  )
}