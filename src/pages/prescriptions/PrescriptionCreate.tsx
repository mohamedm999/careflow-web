import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, IconButton } from '@mui/material'
import { createPrescription } from '../../services/prescriptionService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { getErrorMessage } from '../../utils/errorHandler'

const schema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
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

export default function PrescriptionCreate() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { medications: [{ medicationName: '', dosage: '', frequency: '', duration: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (form: FormData) => {
    try {
      setApiError(null)
      setLoading(true)
      const created = await createPrescription(form)
      navigate(`/prescriptions/${created.id}`)
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Prescription</Typography>

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
                <Button type="submit" variant="contained" fullWidth disabled={loading}>Create Prescription</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}