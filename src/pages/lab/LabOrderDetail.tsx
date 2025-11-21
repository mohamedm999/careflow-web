import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLabOrderById, cancelLabOrder } from '../../services/labOrderService'
import { Stack, Typography, Button, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Container } from '@mui/material'
import { useState } from 'react'

export default function LabOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openCancel, setOpenCancel] = useState(false)
  const { data, isLoading, refetch } = useQuery({ queryKey: ['labOrder', id], queryFn: () => getLabOrderById(id!) })

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!data) return <Container><Typography variant="h6" color="error">Lab order not found</Typography></Container>

  const onCancel = async () => {
    await cancelLabOrder(id!)
    await refetch()
    setOpenCancel(false)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      pending: 'info',
      approved: 'success',
      collected: 'warning',
      completed: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Lab Order Details</Typography>
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
              <Typography variant="caption" color="textSecondary">Test Type</Typography>
              <Typography variant="body1">{data.testType ?? '-'}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Order Date</Typography>
              <Typography variant="body1">{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-'}</Typography>
            </Box>

            {data.scheduledDate && (
              <Box>
                <Typography variant="caption" color="textSecondary">Scheduled Date</Typography>
                <Typography variant="body1">{new Date(data.scheduledDate).toLocaleDateString()}</Typography>
              </Box>
            )}

            {data.notes && (
              <Box>
                <Typography variant="caption" color="textSecondary">Notes</Typography>
                <Typography variant="body1">{data.notes}</Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="outlined" onClick={() => navigate(`/lab/orders/${id}/edit`)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => setOpenCancel(true)} disabled={data.status === 'cancelled'}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>Cancel Lab Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this lab order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)}>Keep</Button>
          <Button color="error" onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}