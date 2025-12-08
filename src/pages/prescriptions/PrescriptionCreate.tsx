import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, IconButton, MenuItem, FormControl, InputLabel, Select, FormHelperText, CircularProgress } from '@mui/material'
import { createPrescription } from '../../services/prescriptionService'
import { getPatients } from '../../services/patientService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { getErrorMessage } from '../../utils/errorHandler'

const medicationSchema = z.object({
  medicationName: z.string().min(2, 'Medication name is required (min 2 chars)'),
  dosage: z.string().min(1, 'Dosage is required'),
  form: z.enum(['tablet', 'capsule', 'liquid', 'injection', 'cream', 'ointment', 'inhaler', 'drops', 'patch', 'suppository', 'other']),
  route: z.enum(['oral', 'sublingual', 'topical', 'intravenous', 'intramuscular', 'subcutaneous', 'inhalation', 'rectal', 'ophthalmic', 'otic', 'nasal']),
  frequency: z.string().min(3, 'Frequency is required'),
  durationValue: z.coerce.number().min(1, 'Duration value is required'),
  durationUnit: z.enum(['days', 'weeks', 'months', 'as_needed']),
  quantity: z.coerce.number().min(1, 'Quantity is required'),
  instructions: z.string().optional()
})

const schema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  priority: z.enum(['routine', 'urgent', 'stat']),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  medications: z.array(medicationSchema).min(1, 'At least one medication is required')
})

type FormData = z.infer<typeof schema>

const formOptions = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'injection', label: 'Injection' },
  { value: 'cream', label: 'Cream' },
  { value: 'ointment', label: 'Ointment' },
  { value: 'inhaler', label: 'Inhaler' },
  { value: 'drops', label: 'Drops' },
  { value: 'patch', label: 'Patch' },
  { value: 'suppository', label: 'Suppository' },
  { value: 'other', label: 'Other' }
]

const routeOptions = [
  { value: 'oral', label: 'Oral' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'topical', label: 'Topical' },
  { value: 'intravenous', label: 'Intravenous' },
  { value: 'intramuscular', label: 'Intramuscular' },
  { value: 'subcutaneous', label: 'Subcutaneous' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'ophthalmic', label: 'Ophthalmic' },
  { value: 'otic', label: 'Otic' },
  { value: 'nasal', label: 'Nasal' }
]

const durationUnitOptions = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'as_needed', label: 'As Needed' }
]

export default function PrescriptionCreate() {
  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'routine',
      medications: [{
        medicationName: '',
        dosage: '',
        form: 'tablet',
        route: 'oral',
        frequency: '',
        durationValue: 7,
        durationUnit: 'days',
        quantity: 1,
        instructions: ''
      }]
    }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch patients for dropdown
  const { data: patientsData, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients-select'],
    queryFn: () => getPatients({ page: 1, limit: 100 })
  })
  const patients = patientsData?.items ?? []

  const onSubmit = async (form: FormData) => {
    try {
      setApiError(null)
      setLoading(true)
      // Transform to backend format
      const payload = {
        patient: form.patient,
        priority: form.priority,
        diagnosis: form.diagnosis,
        notes: form.notes,
        medications: form.medications.map(med => ({
          medicationName: med.medicationName,
          dosage: med.dosage,
          form: med.form,
          route: med.route,
          frequency: med.frequency,
          duration: {
            value: med.durationValue,
            unit: med.durationUnit
          },
          quantity: med.quantity,
          instructions: med.instructions
        }))
      }
      const created = await createPrescription(payload)
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    value={watch('priority') || 'routine'}
                    onChange={(e) => setValue('priority', e.target.value as any)}
                  >
                    <MenuItem value="routine">Routine</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="stat">STAT</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Diagnosis"
                {...register('diagnosis')}
                fullWidth
              />

              <TextField
                label="Notes"
                {...register('notes')}
                multiline
                rows={2}
                fullWidth
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Medications *</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({
                      medicationName: '',
                      dosage: '',
                      form: 'tablet',
                      route: 'oral',
                      frequency: '',
                      durationValue: 7,
                      durationUnit: 'days',
                      quantity: 1,
                      instructions: ''
                    })}
                    size="small"
                    variant="outlined"
                  >
                    Add Medication
                  </Button>
                </Box>

                <Stack gap={2}>
                  {fields.map((field, idx) => (
                    <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack gap={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">Medication #{idx + 1}</Typography>
                          <IconButton
                            onClick={() => remove(idx)}
                            disabled={fields.length === 1}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                          <TextField
                            label="Medication Name *"
                            {...register(`medications.${idx}.medicationName`)}
                            error={!!errors.medications?.[idx]?.medicationName}
                            helperText={errors.medications?.[idx]?.medicationName?.message}
                            fullWidth
                            size="small"
                          />

                          <TextField
                            label="Dosage *"
                            {...register(`medications.${idx}.dosage`)}
                            error={!!errors.medications?.[idx]?.dosage}
                            helperText={errors.medications?.[idx]?.dosage?.message}
                            placeholder="e.g., 500mg"
                            fullWidth
                            size="small"
                          />

                          <Controller
                            name={`medications.${idx}.form`}
                            control={control}
                            render={({ field }) => (
                              <FormControl size="small" fullWidth error={!!errors.medications?.[idx]?.form}>
                                <InputLabel>Form *</InputLabel>
                                <Select {...field} label="Form *">
                                  {formOptions.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                          <Controller
                            name={`medications.${idx}.route`}
                            control={control}
                            render={({ field }) => (
                              <FormControl size="small" fullWidth error={!!errors.medications?.[idx]?.route}>
                                <InputLabel>Route *</InputLabel>
                                <Select {...field} label="Route *">
                                  {routeOptions.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />

                          <TextField
                            label="Frequency *"
                            {...register(`medications.${idx}.frequency`)}
                            error={!!errors.medications?.[idx]?.frequency}
                            helperText={errors.medications?.[idx]?.frequency?.message}
                            placeholder="e.g., twice daily"
                            fullWidth
                            size="small"
                          />

                          <TextField
                            label="Quantity *"
                            type="number"
                            {...register(`medications.${idx}.quantity`)}
                            error={!!errors.medications?.[idx]?.quantity}
                            helperText={errors.medications?.[idx]?.quantity?.message}
                            fullWidth
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 2 }}>
                          <TextField
                            label="Duration Value *"
                            type="number"
                            {...register(`medications.${idx}.durationValue`)}
                            error={!!errors.medications?.[idx]?.durationValue}
                            helperText={errors.medications?.[idx]?.durationValue?.message}
                            fullWidth
                            size="small"
                          />

                          <Controller
                            name={`medications.${idx}.durationUnit`}
                            control={control}
                            render={({ field }) => (
                              <FormControl size="small" fullWidth>
                                <InputLabel>Duration Unit</InputLabel>
                                <Select {...field} label="Duration Unit">
                                  {durationUnitOptions.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />

                          <TextField
                            label="Instructions"
                            {...register(`medications.${idx}.instructions`)}
                            placeholder="Special instructions"
                            fullWidth
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Create Prescription'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}