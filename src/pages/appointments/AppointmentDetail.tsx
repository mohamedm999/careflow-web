import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAppointmentById, cancelAppointment } from '../../services/appointmentService'
import { Stack, Typography, Button, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Container } from '@mui/material'
import { useState } from 'react'

export default function AppointmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openCancel, setOpenCancel] = useState(false)
  const { data, isLoading, refetch } = useQuery({ queryKey: ['appointment', id], queryFn: () => getAppointmentById(id!) })

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!data) return <Container><Typography variant="h6" color="error">Appointment not found</Typography></Container>

  const onCancel = async () => {
    await cancelAppointment(id!)
    await refetch()
    setOpenCancel(false)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      scheduled: 'info',
      completed: 'success',
      cancelled: 'error',
      'no-show': 'warning'
    }
    return colors[status] || 'default'
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Appointment Details</Typography>
            <Chip label={data.status} color={getStatusColor(data.status)} variant="outlined" />
          </Box>

          <Stack gap={2}>
            <Box>
              <Typography variant="caption" color="textSecondary">Patient</Typography>
              <Typography variant="body1">{data.patientId}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Doctor</Typography>
              <Typography variant="body1">{data.doctorId}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Date</Typography>
              <Typography variant="body1">{new Date(data.appointmentDate).toLocaleDateString()}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Time</Typography>
              <Typography variant="body1">{data.appointmentTime}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Duration</Typography>
              <Typography variant="body1">{data.duration ?? '-'} minutes</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Type</Typography>
              <Typography variant="body1">{data.type}</Typography>
            </Box>

            {data.reasonForVisit && (
              <Box>
                <Typography variant="caption" color="textSecondary">Reason for Visit</Typography>
                <Typography variant="body1">{data.reasonForVisit}</Typography>
              </Box>
            )}

            {data.notes && (
              <Box>
                <Typography variant="caption" color="textSecondary">Notes</Typography>
                <Typography variant="body1">{data.notes}</Typography>
              </Box>
            )}

            {data.location && (
              <Box>
                <Typography variant="caption" color="textSecondary">Location</Typography>
                <Typography variant="body1">{data.location}</Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="outlined" onClick={() => navigate(`/appointments/${id}/edit`)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => setOpenCancel(true)} disabled={data.status === 'cancelled'}>Cancel Appointment</Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this appointment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)}>Keep</Button>
          <Button color="error" onClick={onCancel}>Cancel Appointment</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}