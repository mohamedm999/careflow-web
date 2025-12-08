import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, MenuItem, CircularProgress, FormControl, InputLabel, Select, FormHelperText } from '@mui/material'
import { createConsultation } from '../../services/consultationService'
import { getPatients } from '../../services/patientService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getErrorMessage } from '../../utils/errorHandler'

const schema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  consultationType: z.enum(['initial', 'follow_up', 'emergency', 'routine_checkup', 'specialist']),
  chiefComplaint: z.string().min(3, 'Chief complaint is required (min 3 characters)').max(500),
  historyOfPresentIllness: z.string().optional(),
  treatmentPlan: z.string().optional(),
  recommendations: z.string().optional(),
  followUpRequired: z.boolean().optional()
})

type FormData = z.infer<typeof schema>

export default function ConsultationCreate() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consultationType: 'routine_checkup',
      followUpRequired: false
    }
  })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch patients for dropdown
  const { data: patientsData, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients-select'],
    queryFn: () => getPatients({ page: 1, limit: 100 })
  })

  // Note: Doctor is auto-set by backend from authenticated user
  const patients = patientsData?.items ?? []

  const onSubmit = async (form: FormData) => {
    try {
      setApiError(null)
      setLoading(true)
      // Backend expects 'patient' (Patient document ID), doctor is auto-set from auth
      const c = await createConsultation({
        patient: form.patient,
        consultationType: form.consultationType,
        chiefComplaint: form.chiefComplaint,
        historyOfPresentIllness: form.historyOfPresentIllness,
        treatmentPlan: form.treatmentPlan,
        recommendations: form.recommendations,
        followUpRequired: form.followUpRequired
      })
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

  const consultationTypes = [
    { value: 'initial', label: 'Initial Visit' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'routine_checkup', label: 'Routine Checkup' },
    { value: 'specialist', label: 'Specialist' }
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            <Stack gap={3}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl fullWidth error={!!errors.patient}>
                  <InputLabel>Patient *</InputLabel>
                  <Select
                    label="Patient *"
                    value={watch('patient') || ''}
                    onChange={(e) => setValue('patient', e.target.value)}
                    disabled={loadingPatients}
                  >
                    {loadingPatients ? (
                      <MenuItem disabled><CircularProgress size={20} /> Loading...</MenuItem>
                    ) : patients.length === 0 ? (
                      <MenuItem disabled>No patients found</MenuItem>
                    ) : (
                      patients.map((p: any) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.user?.firstName} {p.user?.lastName} - {p.user?.email}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.patient && <FormHelperText>{errors.patient.message}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Consultation Type</InputLabel>
                  <Select
                    label="Consultation Type"
                    value={watch('consultationType') || 'routine_checkup'}
                    onChange={(e) => setValue('consultationType', e.target.value as any)}
                  >
                    {consultationTypes.map(t => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Chief Complaint *"
                {...register('chiefComplaint')}
                error={!!errors.chiefComplaint}
                helperText={errors.chiefComplaint?.message}
                multiline
                rows={2}
                fullWidth
                placeholder="Patient's main reason for visit"
              />

              <TextField
                label="History of Present Illness"
                {...register('historyOfPresentIllness')}
                multiline
                rows={3}
                fullWidth
                placeholder="Detailed description of the current illness"
              />

              <TextField
                label="Treatment Plan"
                {...register('treatmentPlan')}
                multiline
                rows={2}
                fullWidth
              />

              <TextField
                label="Recommendations"
                {...register('recommendations')}
                multiline
                rows={2}
                fullWidth
              />

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Create Consultation'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}