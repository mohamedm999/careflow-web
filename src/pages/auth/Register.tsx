import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack } from '@mui/material'
import { useAppDispatch } from '../../store'
import { register as registerAction } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
})
type FormData = z.infer<typeof schema>

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const dispatch = useAppDispatch()
  const nav = useNavigate()

  const onSubmit = async (data: FormData) => {
    const res = await dispatch(registerAction(data))
    if (registerAction.fulfilled.match(res)) nav('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <TextField label="First Name" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} />
        <TextField label="Last Name" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} />
        <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" variant="contained">Register</Button>
      </Stack>
    </form>
  )
}