import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, IconButton, MenuItem, FormControl, InputLabel, Select, FormHelperText, CircularProgress, Checkbox, FormControlLabel } from '@mui/material'
import { createLabOrder } from '../../services/labOrderService'
import { getPatients } from '../../services/patientService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { getErrorMessage } from '../../utils/errorHandler'

const testSchema = z.object({
  testCode: z.string().min(1, 'Test code is required'),
  testName: z.string().min(1, 'Test name is required'),
  category: z.enum(['hematology', 'biochemistry', 'microbiology', 'immunology', 'pathology', 'radiology', 'molecular', 'toxicology', 'genetics', 'other']),
  specimenType: z.enum(['blood', 'urine', 'stool', 'saliva', 'tissue', 'swab', 'cerebrospinal_fluid', 'sputum', 'other']),
  fastingRequired: z.boolean(),
  instructions: z.string().optional()
})

const schema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  priority: z.enum(['routine', 'urgent', 'stat']),
  clinicalNotes: z.string().optional(),
  provisionalDiagnosis: z.string().optional(),
  tests: z.array(testSchema).min(1, 'At least one test is required')
})

type FormData = z.infer<typeof schema>

const categoryOptions = [
  { value: 'hematology', label: 'Hematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'immunology', label: 'Immunology' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'molecular', label: 'Molecular' },
  { value: 'toxicology', label: 'Toxicology' },
  { value: 'genetics', label: 'Genetics' },
  { value: 'other', label: 'Other' }
]

const specimenTypeOptions = [
  { value: 'blood', label: 'Blood' },
  { value: 'urine', label: 'Urine' },
  { value: 'stool', label: 'Stool' },
  { value: 'saliva', label: 'Saliva' },
  { value: 'tissue', label: 'Tissue' },
  { value: 'swab', label: 'Swab' },
  { value: 'cerebrospinal_fluid', label: 'Cerebrospinal Fluid' },
  { value: 'sputum', label: 'Sputum' },
  { value: 'other', label: 'Other' }
]

export default function LabOrderCreate() {
  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'routine',
      tests: [{
        testCode: '',
        testName: '',
        category: 'biochemistry',
        specimenType: 'blood',
        fastingRequired: false,
        instructions: ''
      }]
    }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'tests' })
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
      const o = await createLabOrder(form)
      navigate(`/lab/orders/${o.id}`)
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Lab Order</Typography>

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
                    <MenuItem value="asap">ASAP</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Clinical Notes"
                {...register('clinicalNotes')}
                multiline
                rows={2}
                fullWidth
              />

              <TextField
                label="Provisional Diagnosis"
                {...register('provisionalDiagnosis')}
                fullWidth
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Tests *</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({
                      testCode: '',
                      testName: '',
                      category: 'biochemistry',
                      specimenType: 'blood',
                      fastingRequired: false,
                      instructions: ''
                    })}
                    size="small"
                    variant="outlined"
                  >
                    Add Test
                  </Button>
                </Box>

                <Stack gap={2}>
                  {fields.map((field, idx) => (
                    <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack gap={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">Test #{idx + 1}</Typography>
                          <IconButton
                            onClick={() => remove(idx)}
                            disabled={fields.length === 1}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
                          <TextField
                            label="Test Code *"
                            {...register(`tests.${idx}.testCode`)}
                            error={!!errors.tests?.[idx]?.testCode}
                            helperText={errors.tests?.[idx]?.testCode?.message}
                            placeholder="e.g., CBC001"
                            fullWidth
                            size="small"
                          />

                          <TextField
                            label="Test Name *"
                            {...register(`tests.${idx}.testName`)}
                            error={!!errors.tests?.[idx]?.testName}
                            helperText={errors.tests?.[idx]?.testName?.message}
                            placeholder="e.g., Complete Blood Count"
                            fullWidth
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                          <Controller
                            name={`tests.${idx}.category`}
                            control={control}
                            render={({ field }) => (
                              <FormControl size="small" fullWidth error={!!errors.tests?.[idx]?.category}>
                                <InputLabel>Category *</InputLabel>
                                <Select {...field} label="Category *">
                                  {categoryOptions.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />

                          <Controller
                            name={`tests.${idx}.specimenType`}
                            control={control}
                            render={({ field }) => (
                              <FormControl size="small" fullWidth error={!!errors.tests?.[idx]?.specimenType}>
                                <InputLabel>Specimen Type *</InputLabel>
                                <Select {...field} label="Specimen Type *">
                                  {specimenTypeOptions.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />

                          <Controller
                            name={`tests.${idx}.fastingRequired`}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                  />
                                }
                                label="Fasting Required"
                              />
                            )}
                          />
                        </Box>

                        <TextField
                          label="Instructions"
                          {...register(`tests.${idx}.instructions`)}
                          placeholder="Special instructions for this test"
                          fullWidth
                          size="small"
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Create Lab Order'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}