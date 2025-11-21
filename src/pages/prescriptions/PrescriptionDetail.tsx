import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPrescriptionById, signPrescription, dispensePrescription, cancelPrescription } from '../../services/prescriptionService'
import { Stack, Typography, Button, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useState } from 'react'

export default function PrescriptionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openCancel, setOpenCancel] = useState(false)
  const { data, isLoading, refetch } = useQuery({ queryKey: ['prescription', id], queryFn: () => getPrescriptionById(id!) })

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!data) return <Container><Typography variant="h6" color="error">Prescription not found</Typography></Container>

  const act = async (fn: (id: string) => Promise<unknown>) => { await fn(id!); await refetch() }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      draft: 'info',
      signed: 'warning',
      dispensed: 'success',
      completed: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Prescription Details</Typography>
            <Chip label={data.status} color={getStatusColor(data.status)} variant="outlined" />
          </Box>

          <Stack gap={2} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">Patient</Typography>
              <Typography variant="body1">{data.patientId}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Doctor</Typography>
              <Typography variant="body1">{data.doctorId}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Start Date</Typography>
              <Typography variant="body1">{new Date(data.startDate).toLocaleDateString()}</Typography>
            </Box>

            {data.endDate && (
              <Box>
                <Typography variant="caption" color="textSecondary">End Date</Typography>
                <Typography variant="body1">{new Date(data.endDate).toLocaleDateString()}</Typography>
              </Box>
            )}
          </Stack>

          {data.medications && data.medications.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Medications</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.medications.map((med: Record<string, unknown>, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{String(med.medicationName ?? '-')}</TableCell>
                      <TableCell>{String(med.dosage ?? '-')}</TableCell>
                      <TableCell>{String(med.frequency ?? '-')}</TableCell>
                      <TableCell>{String(med.duration ?? '-')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {data.notes && (
            <Box>
              <Typography variant="caption" color="textSecondary">Notes</Typography>
              <Typography variant="body1">{data.notes}</Typography>
            </Box>
          )}

          <Stack direction="row" gap={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="outlined" onClick={() => navigate(`/prescriptions/${id}/edit`)}>Edit</Button>
            <Button variant="contained" onClick={() => act(signPrescription)} disabled={data.status !== 'draft'}>Sign</Button>
            <Button variant="contained" onClick={() => act(dispensePrescription)} disabled={data.status !== 'signed'}>Dispense</Button>
            <Button color="error" onClick={() => setOpenCancel(true)} disabled={data.status === 'cancelled'}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>Cancel Prescription</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this prescription?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)}>Keep</Button>
          <Button color="error" onClick={async () => { await act(cancelPrescription); setOpenCancel(false) }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}