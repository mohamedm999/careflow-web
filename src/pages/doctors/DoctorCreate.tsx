import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, Typography, Paper, Container, Alert, Box } from '@mui/material'
import { createDoctor } from '../../services/doctorService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getErrorMessage } from '../../utils/errorHandler'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0, 'Years must be 0 or more').optional()
})

type FormData = z.infer<typeof schema>

export default function DoctorCreate() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (form: FormData) => {
    try {
      setApiError(null)
      setLoading(true)
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        specialization: form.specialization,
        licenseNumber: form.licenseNumber,
        yearsOfExperience: form.yearsOfExperience
      }
      const created = await createDoctor(payload)
      navigate(`/doctors/${created.id}`)
    } catch (err) {
      const error = getErrorMessage(err)
      setApiError({
        message: error.message,
        details: error.details
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Doctor</Typography>

          {apiError && (
            <Alert severity="error">
              <Stack gap={1}>
                <strong>{apiError.message}</strong>
                {apiError.details && <Box sx={{ fontSize: '0.875rem', opacity: 0.8, whiteSpace: 'pre-line' }}>{apiError.details}</Box>}
              </Stack>
            </Alert>
          )}

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
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? 'Creating...' : 'Create Doctor'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}
