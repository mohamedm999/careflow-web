import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Typography, TextField, Button, MenuItem, Paper, Container, Alert, Box } from '@mui/material'
import { uploadDocument } from '../../services/documentService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const schema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  documentType: z.enum(['prescription','lab_result','consultation','general','imaging','vaccine']),
  description: z.string().optional(),
  file: z.any().refine(files => files?.[0], 'File is required').refine(files => files?.[0]?.size <= MAX_FILE_SIZE, `File must be smaller than 50MB`)
})

type FormData = z.infer<typeof schema>

export default function DocumentUpload() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { documentType: 'general' } })
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileValue = watch('file')
  const fileName = fileValue?.[0]?.name

  const onSubmit = async (form: FormData) => {
    try {
      setError(null)
      setLoading(true)
      const file = (form.file as FileList)?.[0] as File
      const d = await uploadDocument({
        patientId: form.patientId,
        documentType: form.documentType,
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

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Upload Document</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={3}>
              <TextField
                label="Patient ID"
                {...register('patientId')}
                error={!!errors.patientId}
                helperText={errors.patientId?.message}
                fullWidth
              />

              <TextField
                select
                label="Document Type"
                defaultValue="general"
                {...register('documentType')}
                error={!!errors.documentType}
                helperText={errors.documentType?.message}
                fullWidth
              >
                <MenuItem value="prescription">Prescription</MenuItem>
                <MenuItem value="lab_result">Lab Result</MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="imaging">Imaging</MenuItem>
                <MenuItem value="vaccine">Vaccine</MenuItem>
              </TextField>

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