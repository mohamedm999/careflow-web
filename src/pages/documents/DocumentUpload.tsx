import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, MenuItem, Paper, Container, Alert, Box, FormControl, InputLabel, Select, FormHelperText, CircularProgress } from '@mui/material'
import { uploadDocument } from '../../services/documentService'
import { getPatients } from '../../services/patientService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const schema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  category: z.enum(['imaging', 'lab_report', 'prescription', 'consent_form', 'medical_record', 'discharge_summary', 'operative_report', 'pathology_report', 'radiology_report', 'progress_note', 'other']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  file: z.any().refine(files => files?.[0], 'File is required').refine(files => files?.[0]?.size <= MAX_FILE_SIZE, `File must be smaller than 50MB`)
})

type FormData = z.infer<typeof schema>

const categoryOptions = [
  { value: 'imaging', label: 'Imaging' },
  { value: 'lab_report', label: 'Lab Report' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'consent_form', label: 'Consent Form' },
  { value: 'medical_record', label: 'Medical Record' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'operative_report', label: 'Operative Report' },
  { value: 'pathology_report', label: 'Pathology Report' },
  { value: 'radiology_report', label: 'Radiology Report' },
  { value: 'progress_note', label: 'Progress Note' },
  { value: 'other', label: 'Other' }
]

export default function DocumentUpload() {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormData>({ 
    resolver: zodResolver(schema), 
    defaultValues: { 
      patient: '',
      category: 'other',
      title: '',
      description: ''
    } 
  })
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileValue = watch('file')
  const fileName = fileValue?.[0]?.name

  // Fetch patients for dropdown
  const { data: patientsData, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients-select'],
    queryFn: () => getPatients({ page: 1, limit: 100 })
  })
  const patients = patientsData?.items ?? []

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      const file = (form.file as FileList)?.[0] as File
      const d = await uploadDocument({
        patient: form.patient,
        category: form.category,
        title: form.title,
        description: form.description,
        file
      })
      navigate(`/documents/${d.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document')
    } finally {
      setLoading(false)
    }
  }

  // Helper to get patient display name
  const getPatientName = (patient: any) => {
    if (patient.user?.firstName) {
      return `${patient.user.firstName} ${patient.user.lastName}`
    }
    if (patient.firstName) {
      return `${patient.firstName} ${patient.lastName}`
    }
    return 'Unknown Patient'
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Upload Document</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={3}>
              <Controller
                name="patient"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.patient}>
                    <InputLabel>Patient</InputLabel>
                    <Select {...field} label="Patient" disabled={loadingPatients}>
                      {loadingPatients ? (
                        <MenuItem disabled><CircularProgress size={20} /> Loading...</MenuItem>
                      ) : patients.length === 0 ? (
                        <MenuItem disabled>No patients found</MenuItem>
                      ) : (
                        patients.map((p: any) => (
                          <MenuItem key={p.id} value={p.id}>
                            {getPatientName(p)}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.patient && <FormHelperText>{errors.patient.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              <TextField
                label="Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
                placeholder="Document title"
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categoryOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              <TextField
                label="Description"
                {...register('description')}
                multiline
                rows={2}
                fullWidth
              />

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: errors.file ? 'error.main' : 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                }}
              >
                <input
                  type="file"
                  {...register('file')}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle2">Click to select file</Typography>
                  <Typography variant="caption" color="textSecondary">or drag and drop</Typography>
                </label>

                {fileName && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                    ✓ {fileName}
                  </Typography>
                )}
              </Box>

              {errors.file && (
                <Alert severity="error">{String(errors.file.message)}</Alert>
              )}

              <Typography variant="caption" color="textSecondary">
                Max file size: 50MB
              </Typography>

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>Upload</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}