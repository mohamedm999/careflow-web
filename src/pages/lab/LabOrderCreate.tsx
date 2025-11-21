import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, Paper, Container, Alert, Box, IconButton } from '@mui/material'
import { createLabOrder } from '../../services/labOrderService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { getErrorMessage } from '../../utils/errorHandler'

const schema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
  tests: z.array(z.object({
    testName: z.string().min(1, 'Test name is required'),
    description: z.string().optional()
  })).min(1, 'At least one test is required')
})

type FormData = z.infer<typeof schema>

export default function LabOrderCreate() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tests: [{ testName: '', description: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'tests' })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<{ message: string; details?: string } | null>(null)
  const [loading, setLoading] = useState(false)

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
    <Container maxWidth="md" sx={{ py: 4 }}>
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
                <Button type="submit" variant="contained" fullWidth disabled={loading}>Create Lab Order</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}