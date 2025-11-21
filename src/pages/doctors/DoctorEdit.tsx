import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, Typography, Paper, Container, Alert, Box, CircularProgress } from '@mui/material'
import { getDoctorById, updateDoctor } from '../../services/doctorService'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0, 'Years must be 0 or more').optional()
})

type FormData = z.infer<typeof schema>

export default function DoctorEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: doctor, isLoading: doctorLoading } = useQuery({ queryKey: ['doctor', id], queryFn: () => getDoctorById(id!) })
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (doctorLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!doctor) return <Container><Typography variant="h6" color="error">Doctor not found</Typography></Container>

  setValue('firstName', doctor.user.firstName)
  setValue('lastName', doctor.user.lastName)
  setValue('email', doctor.user.email)
  setValue('specialization', doctor.specialization ?? '')
  setValue('licenseNumber', doctor.licenseNumber ?? '')
  setValue('yearsOfExperience', doctor.yearsOfExperience ?? 0)

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        specialization: form.specialization,
        licenseNumber: form.licenseNumber,
        yearsOfExperience: form.yearsOfExperience
      }
      await updateDoctor(id!, payload)
      navigate(`/doctors/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Doctor</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="First Name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  fullWidth
                />

                <TextField
                  label="Last Name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  fullWidth
                />
              </Box>

              <TextField
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />

              <TextField
                label="Specialization"
                {...register('specialization')}
                placeholder="e.g., Cardiology, Pediatrics"
                fullWidth
              />

              <TextField
                label="License Number"
                {...register('licenseNumber')}
                fullWidth
              />

              <TextField
                label="Years of Experience"
                type="number"
                inputProps={{ min: 0 }}
                {...register('yearsOfExperience')}
                error={!!errors.yearsOfExperience}
                helperText={errors.yearsOfExperience?.message}
                fullWidth
              />

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>Save Changes</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}
