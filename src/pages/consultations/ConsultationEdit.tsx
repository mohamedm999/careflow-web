import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, CircularProgress, MenuItem } from '@mui/material'
import { getConsultationById, updateConsultation } from '../../services/consultationService'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../../services/patientService'
import { getDoctors } from '../../services/doctorService'
import { useState } from 'react'

const schema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  date: z.string().min(1, 'Date is required'),
  chiefComplaint: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  notes: z.string().optional()
})

type FormData = z.infer<typeof schema>

export default function ConsultationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: consultation, isLoading: consultationLoading } = useQuery({ queryKey: ['consultation', id], queryFn: () => getConsultationById(id!) })
  const { data: patientsData } = useQuery({ queryKey: ['patients', 1], queryFn: () => getPatients({ page: 1, limit: 100 }) })
  const { data: doctorsData } = useQuery({ queryKey: ['doctors', 1], queryFn: () => getDoctors({ page: 1, limit: 100 }) })
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (consultationLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!consultation) return <Container><Typography variant="h6" color="error">Consultation not found</Typography></Container>

  setValue('patientId', consultation.patientId)
  setValue('doctorId', consultation.doctorId)
  setValue('date', consultation.date)
  setValue('chiefComplaint', consultation.chiefComplaint ?? '')
  setValue('diagnosis', consultation.diagnosis ?? '')
  setValue('treatmentPlan', consultation.treatmentPlan ?? '')
  setValue('notes', consultation.notes ?? '')

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      await updateConsultation(id!, form)
      navigate(`/consultations/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update consultation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Consultation</Typography>

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
                label="Diagnosis"
                {...register('diagnosis')}
                multiline
                rows={2}
                fullWidth
              />

              <TextField
                label="Treatment Plan"
                {...register('treatmentPlan')}
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
