import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box } from '@mui/material'
import { createConsultation } from '../../services/consultationService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getErrorMessage } from '../../utils/errorHandler'

const schema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  date: z.string().min(1, 'Date is required'),
  chiefComplaint: z.string().optional(),
  notes: z.string().optional()
})

type FormData = z.infer<typeof schema>

export default function ConsultationCreate() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (form: FormData) => {
    try {
      setApiError(null)
      setLoading(true)
      const c = await createConsultation(form)
      navigate(`/consultations/${c.id}`)
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Consultation</Typography>

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
              <TextField
                label="Patient ID"
                {...register('patientId')}
                error={!!errors.patientId}
                helperText={errors.patientId?.message}
                fullWidth
              />

              <TextField
                label="Doctor ID"
                {...register('doctorId')}
                error={!!errors.doctorId}
                helperText={errors.doctorId?.message}
                fullWidth
              />

              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('date')}
                error={!!errors.date}
                helperText={errors.date?.message}
                fullWidth
              />

              <TextField
                label="Chief Complaint"
                {...register('chiefComplaint')}
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
                <Button type="submit" variant="contained" fullWidth disabled={loading}>Create</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}