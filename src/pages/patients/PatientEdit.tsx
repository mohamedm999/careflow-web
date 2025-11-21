import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, MenuItem, Typography } from '@mui/material'
import { getPatientById, updatePatient } from '../../services/patientService'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male','female','other','prefer_not_to_say']).optional(),
  bloodType: z.enum(['A+','A-','B+','B-','AB+','AB-','O+','O-','unknown']).optional()
})

type FormData = z.infer<typeof schema>

export default function PatientEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey: ['patient', id], queryFn: () => getPatientById(id!) })
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Not found</div>

  setValue('firstName', data.user.firstName)
  setValue('lastName', data.user.lastName)
  setValue('email', data.user.email)
  setValue('dateOfBirth', data.dateOfBirth ?? '')
  setValue('gender', (data.gender as unknown as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined))
  setValue('bloodType', (data.bloodType as unknown as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown' | undefined))

  const onSubmit = async (form: FormData) => {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodType: form.bloodType
    }
    await updatePatient(id!, payload)
    navigate(`/patients/${id}`)
  }

  return (
    <Stack gap={2}>
      <Typography variant="h5">Edit Patient</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <TextField label="First Name" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} />
          <TextField label="Last Name" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} />
          <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} {...register('dateOfBirth')} />
          <TextField select label="Gender" defaultValue="" {...register('gender')}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
          </TextField>
          <TextField select label="Blood Type" defaultValue="" {...register('bloodType')}>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-','unknown'].map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained">Save</Button>
        </Stack>
      </form>
    </Stack>
  )
}