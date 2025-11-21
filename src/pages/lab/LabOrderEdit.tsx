import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, IconButton, MenuItem, CircularProgress } from '@mui/material'
import { getLabOrderById, updateLabOrder } from '../../services/labOrderService'
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
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
  tests: z.array(z.object({
    testName: z.string().min(1, 'Test name is required'),
    description: z.string().optional()
  })).min(1, 'At least one test is required')
})

type FormData = z.infer<typeof schema>

export default function LabOrderEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: labOrder, isLoading: labOrderLoading } = useQuery({ queryKey: ['labOrder', id], queryFn: () => getLabOrderById(id!) })
  const { data: patientsData } = useQuery({ queryKey: ['patients', 1], queryFn: () => getPatients({ page: 1, limit: 100 }) })
  const { data: doctorsData } = useQuery({ queryKey: ['doctors', 1], queryFn: () => getDoctors({ page: 1, limit: 100 }) })
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tests: [{ testName: '', description: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'tests' })

  if (labOrderLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!labOrder) return <Container><Typography variant="h6" color="error">Lab Order not found</Typography></Container>

  setValue('patientId', labOrder.patientId)
  setValue('doctorId', labOrder.doctorId)
  setValue('scheduledDate', labOrder.scheduledDate ?? '')
  setValue('notes', labOrder.notes ?? '')
  labOrder.tests.forEach((test, idx) => {
    setValue(`tests.${idx}.testName`, test.testName)
    setValue(`tests.${idx}.description`, test.testCode ?? '')
  })

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      await updateLabOrder(id!, form)
      navigate(`/lab/orders/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lab order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Lab Order</Typography>

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

              <TextField
                label="Scheduled Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('scheduledDate')}
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Tests</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({ testName: '', description: '' })}
                    size="small"
                  >
                    Add Test
                  </Button>
                </Box>

                <Stack gap={2}>
                  {fields.map((field, idx) => (
                    <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack gap={2}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, alignItems: 'flex-start' }}>
                          <TextField
                            label="Test Name"
                            {...register(`tests.${idx}.testName`)}
                            error={!!errors.tests?.[idx]?.testName}
                            helperText={errors.tests?.[idx]?.testName?.message}
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

                        <TextField
                          label="Description"
                          {...register(`tests.${idx}.description`)}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                {errors.tests && typeof errors.tests === 'object' && !('length' in errors.tests) && (
                  <Typography color="error" variant="caption">{String(errors.tests)}</Typography>
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
