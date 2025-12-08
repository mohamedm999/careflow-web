import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPrescriptions } from '../../services/prescriptionService'
import { Stack, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip, CircularProgress, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function PrescriptionList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['prescriptions', page], queryFn: () => getPrescriptions({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'success'
      case 'draft': return 'warning'
      case 'sent': return 'info'
      case 'dispensed': return 'success'
      case 'cancelled': return 'error'
      case 'expired': return 'default'
      default: return 'default'
    }
  }

  return (
    <Stack gap={2}>
      <Typography variant="h5">Prescriptions</Typography>
      <Stack direction="row" gap={2}>
        <TextField label="Search" />
        <Button variant="contained" component={Link} to="/prescriptions/new">New Prescription</Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Prescription #</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Medications</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={7}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={7}>No prescriptions</TableCell></TableRow>
          ) : (
            items.map((p: any) => (
              <TableRow 
                key={p.id} 
                hover 
                onClick={() => navigate(`/prescriptions/${p.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{p.prescriptionNumber || '-'}</TableCell>
                <TableCell>
                  {p.patient?.user ? `${p.patient.user.firstName} ${p.patient.user.lastName}` :
                   p.patient?.firstName ? `${p.patient.firstName} ${p.patient.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>{p.medications?.length || 0} medication(s)</TableCell>
                <TableCell><Chip label={p.priority || 'routine'} size="small" /></TableCell>
                <TableCell><Chip label={p.status} color={getStatusColor(p.status) as any} size="small" /></TableCell>
                <TableCell>{p.prescriptionDate ? new Date(p.prescriptionDate).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}