import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, MenuItem, Typography, Paper, Container, Box, Alert } from '@mui/material'
import { createAppointment } from '../../services/appointmentService'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../../services/patientService'
import { getDoctors } from '../../services/doctorService'
import { useState } from 'react'
import { getErrorMessage } from '../../utils/errorHandler'
import { Patient, Doctor } from '../../types/models'

const schema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  type: z.enum(['consultation', 'checkup', 'procedure', 'follow-up']),
  reasonForVisit: z.string().min(1, 'Reason for visit is required'),
  notes: z.string().optional()
})

type FormData = z.infer<typeof schema>

export default function AppointmentCreate() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'consultation',
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: 30,
      reasonForVisit: '',
      notes: ''
    }
  })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: patientsData } = useQuery({ queryKey: ['patients', 1], queryFn: () => getPatients({ page: 1, limit: 100 }) })
  const { data: doctorsData } = useQuery({ queryKey: ['doctors', 1], queryFn: () => getDoctors({ page: 1, limit: 100 }) })

  const onSubmit = async (form: FormData) => {
    try {
      setApiError(null)
      setLoading(true)
      const created = await createAppointment(form)
      navigate(`/appointments/${created.id}`)
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Appointment</Typography>

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
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Patient"
                    {...field}
                    value={field.value ?? ''}
                    error={!!errors.patientId}
                    helperText={errors.patientId?.message}
                    fullWidth
                  >
                    <MenuItem value="">Select Patient</MenuItem>
                    {(patientsData?.items ?? [])
                      .filter((p: Patient) => p && p.user)
                      .map((p: Patient) => (
                        <MenuItem key={p.id} value={p.user.id}>
                          {p.user.firstName} {p.user.lastName} ({p.user.email})
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />


              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Doctor"
                    {...field}
                    value={field.value ?? ''}
                    error={!!errors.doctorId}
                    helperText={errors.doctorId?.message}
                    fullWidth
                  >
                    <MenuItem value="">Select Doctor</MenuItem>
                    {(doctorsData?.items ?? []).map((d: Doctor) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.user.firstName} {d.user.lastName} {d.specialization ? `(${d.specialization})` : ''} ({d.user.email})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('appointmentDate')}
                  error={!!errors.appointmentDate}
                  helperText={errors.appointmentDate?.message}
                  fullWidth
                />

                <TextField
                  label="Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  {...register('appointmentTime')}
                  error={!!errors.appointmentTime}
                  helperText={errors.appointmentTime?.message}
                  fullWidth
                />
              </Box>

              <TextField
                label="Duration (minutes)"
                type="number"
                inputProps={{ min: 1 }}
                {...register('duration')}
                error={!!errors.duration}
                helperText={errors.duration?.message}
                fullWidth
              />

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Appointment Type"
                    {...field}
                    value={field.value ?? 'consultation'}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    fullWidth
                  >
                    <MenuItem value="consultation">Consultation</MenuItem>
                    <MenuItem value="checkup">Checkup</MenuItem>
                    <MenuItem value="procedure">Procedure</MenuItem>
                    <MenuItem value="follow-up">Follow-up</MenuItem>
                  </TextField>
                )}
              />

              <TextField
                label="Reason for Visit"
                {...register('reasonForVisit')}
                multiline
                rows={2}
                fullWidth
              />

              <TextField
                label="Notes"
                {...register('notes')}
                multiline
                rows={2}
                fullWidth
              />

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? 'Creating...' : 'Create Appointment'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}