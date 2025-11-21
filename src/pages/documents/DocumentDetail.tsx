import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDocumentById, deleteDocument } from '../../services/documentService'
import { Stack, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Container, Chip } from '@mui/material'
import { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'

export default function DocumentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({ queryKey: ['document', id], queryFn: () => getDocumentById(id!) })

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!data) return <Container><Typography variant="h6" color="error">Document not found</Typography></Container>

  const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/documents/${id}/download`

  const onDelete = async () => {
    await deleteDocument(id!)
    navigate('/documents')
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Document Details</Typography>
          </Box>

          <Stack gap={2}>
            <Box>
              <Typography variant="caption" color="textSecondary">File Name</Typography>
              <Typography variant="body1">{data.fileName}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Document Type</Typography>
              <Chip label={data.documentType} size="small" />
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Patient</Typography>
              <Typography variant="body1">{data.patientId}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Size</Typography>
              <Typography variant="body1">{data.fileSize ? `${(Number(data.fileSize) / 1024).toFixed(2)} KB` : '-'}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Uploaded</Typography>
              <Typography variant="body1">{(data.uploadedAt || data.createdAt) ? new Date(String(data.uploadedAt || data.createdAt)).toLocaleDateString() : '-'}</Typography>
            </Box>

            {data.description && (
              <Box>
                <Typography variant="caption" color="textSecondary">Description</Typography>
                <Typography variant="body1">{data.description}</Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="contained" startIcon={<DownloadIcon />} component="a" href={downloadUrl} target="_blank">Download</Button>
            <Button color="error" onClick={() => setOpenDelete(true)}>Delete</Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this document? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Keep</Button>
          <Button color="error" onClick={onDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}