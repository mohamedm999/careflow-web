import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, IconButton, MenuItem, CircularProgress } from '@mui/material'
import { getPrescriptionById, updatePrescription } from '../../services/prescriptionService'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../../services/patientService'
import { getDoctors } from '../../services/doctorService'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const schema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  medications: z.array(z.object({
    medicationName: z.string().min(1, 'Medication name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().optional(),
    duration: z.string().optional()
  })).min(1, 'At least one medication is required')
})

type FormData = z.infer<typeof schema>

export default function PrescriptionEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: prescription, isLoading: prescriptionLoading } = useQuery({ queryKey: ['prescription', id], queryFn: () => getPrescriptionById(id!) })
  const { data: patientsData } = useQuery({ queryKey: ['patients', 1], queryFn: () => getPatients({ page: 1, limit: 100 }) })
  const { data: doctorsData } = useQuery({ queryKey: ['doctors', 1], queryFn: () => getDoctors({ page: 1, limit: 100 }) })
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { medications: [{ medicationName: '', dosage: '', frequency: '', duration: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' })

  if (prescriptionLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!prescription) return <Container><Typography variant="h6" color="error">Prescription not found</Typography></Container>

  setValue('patientId', prescription.patientId)
  setValue('doctorId', prescription.doctorId)
  setValue('startDate', prescription.startDate)
  setValue('endDate', prescription.endDate ?? '')
  setValue('notes', prescription.notes ?? '')
  prescription.medications.forEach((med, idx) => {
    setValue(`medications.${idx}.medicationName`, med.medicationName)
    setValue(`medications.${idx}.dosage`, med.dosage)
    setValue(`medications.${idx}.frequency`, med.frequency ?? '')
    setValue(`medications.${idx}.duration`, med.duration ?? '')
  })

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      await updatePrescription(id!, form)
      navigate(`/prescriptions/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Prescription</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={3}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('startDate')}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                  fullWidth
                />

                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('endDate')}
                  fullWidth
                />
              </Box>

              <TextField
                label="Notes"
                {...register('notes')}
                multiline
                rows={2}
                fullWidth
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Medications</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({ medicationName: '', dosage: '', frequency: '', duration: '' })}
                    size="small"
                  >
                    Add
                  </Button>
                </Box>

                <Stack gap={2}>
                  {fields.map((field, idx) => (
                    <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack gap={2}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <TextField
                            label="Medication Name"
                            {...register(`medications.${idx}.medicationName`)}
                            error={!!errors.medications?.[idx]?.medicationName}
                            helperText={errors.medications?.[idx]?.medicationName?.message}
                            fullWidth
                            size="small"
                          />

                          <TextField
                            label="Dosage"
                            {...register(`medications.${idx}.dosage`)}
                            error={!!errors.medications?.[idx]?.dosage}
                            helperText={errors.medications?.[idx]?.dosage?.message}
                            fullWidth
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2, alignItems: 'flex-start' }}>
                          <TextField
                            label="Frequency"
                            {...register(`medications.${idx}.frequency`)}
                            placeholder="e.g., twice daily"
                            fullWidth
                            size="small"
                          />

                          <TextField
                            label="Duration"
                            {...register(`medications.${idx}.duration`)}
                            placeholder="e.g., 7 days"
                            fullWidth
                            size="small"
                          />

                          <IconButton
                            onClick={() => remove(idx)}
                            disabled={fields.length === 1}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                {errors.medications && typeof errors.medications === 'object' && !('length' in errors.medications) && (
                  <Typography color="error" variant="caption">{String(errors.medications)}</Typography>
                )}
              </Box>

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
