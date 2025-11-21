import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDoctorById, deleteDoctor } from '../../services/doctorService'
import { Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Container, Paper } from '@mui/material'
import { useState } from 'react'

export default function DoctorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({ queryKey: ['doctor', id], queryFn: () => getDoctorById(id!) })

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!data) return <Container><Typography variant="h6" color="error">Doctor not found</Typography></Container>

  const onDelete = async () => {
    await deleteDoctor(id!)
    navigate('/doctors')
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Doctor Details</Typography>

          <Stack gap={2}>
            <Box>
              <Typography variant="caption" color="textSecondary">Name</Typography>
              <Typography variant="body1">{data.user.firstName} {data.user.lastName}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Email</Typography>
              <Typography variant="body1">{data.user.email}</Typography>
            </Box>

            {data.specialization && (
              <Box>
                <Typography variant="caption" color="textSecondary">Specialization</Typography>
                <Typography variant="body1">{data.specialization}</Typography>
              </Box>
            )}

            {data.licenseNumber && (
              <Box>
                <Typography variant="caption" color="textSecondary">License Number</Typography>
                <Typography variant="body1">{data.licenseNumber}</Typography>
              </Box>
            )}

            {data.yearsOfExperience !== undefined && (
              <Box>
                <Typography variant="caption" color="textSecondary">Years of Experience</Typography>
                <Typography variant="body1">{data.yearsOfExperience} years</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="caption" color="textSecondary">Status</Typography>
              <Typography variant="body1">{data.user.isActive ? 'Active' : 'Inactive'}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="outlined" onClick={() => navigate(`/doctors/${id}/edit`)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>Delete</Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Doctor</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this doctor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={onDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
