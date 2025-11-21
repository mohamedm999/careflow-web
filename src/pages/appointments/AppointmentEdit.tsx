import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Stack, MenuItem, Typography, Paper, Container, Box, Alert, CircularProgress } from '@mui/material'
import { getAppointmentById, updateAppointment } from '../../services/appointmentService'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../../services/patientService'
import { getDoctors } from '../../services/doctorService'
import { useState } from 'react'

const schema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  type: z.enum(['consultation','checkup','procedure','follow-up']),
  reasonForVisit: z.string().optional(),
  notes: z.string().optional()
})

type FormData = z.infer<typeof schema>

export default function AppointmentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: appointment, isLoading: appointmentLoading } = useQuery({ queryKey: ['appointment', id], queryFn: () => getAppointmentById(id!) })
  const { data: patientsData } = useQuery({ queryKey: ['patients', 1], queryFn: () => getPatients({ page: 1, limit: 100 }) })
  const { data: doctorsData } = useQuery({ queryKey: ['doctors', 1], queryFn: () => getDoctors({ page: 1, limit: 100 }) })
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (appointmentLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!appointment) return <Container><Typography variant="h6" color="error">Appointment not found</Typography></Container>

  setValue('patientId', appointment.patientId)
  setValue('doctorId', appointment.doctorId)
  setValue('appointmentDate', appointment.appointmentDate)
  setValue('appointmentTime', appointment.appointmentTime)
  setValue('duration', appointment.duration)
  setValue('type', appointment.type)
  setValue('reasonForVisit', appointment.reasonForVisit ?? '')
  setValue('notes', appointment.notes ?? '')

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      await updateAppointment(id!, form)
      navigate(`/appointments/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Appointment</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <TextField
                select
                label="Patient"
                {...register('patientId')}
                error={!!errors.patientId}
                helperText={errors.patientId?.message}
                fullWidth
              >
                <MenuItem value="">Select Patient</MenuItem>
                {(patientsData?.items ?? []).map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.user.firstName} {p.user.lastName} ({p.user.email})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Doctor"
                {...register('doctorId')}
                error={!!errors.doctorId}
                helperText={errors.doctorId?.message}
                fullWidth
              >
                <MenuItem value="">Select Doctor</MenuItem>
                {(doctorsData?.items ?? []).map(d => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.user.firstName} {d.user.lastName} {d.specialization ? `(${d.specialization})` : ''} ({d.user.email})
                  </MenuItem>
                ))}
              </TextField>

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

              <TextField
                select
                label="Appointment Type"
                {...register('type')}
                error={!!errors.type}
                helperText={errors.type?.message}
                fullWidth
              >
                <MenuItem value="consultation">Consultation</MenuItem>
                <MenuItem value="checkup">Checkup</MenuItem>
                <MenuItem value="procedure">Procedure</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
              </TextField>

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
                <Button type="submit" variant="contained" fullWidth disabled={loading}>Save Changes</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}
