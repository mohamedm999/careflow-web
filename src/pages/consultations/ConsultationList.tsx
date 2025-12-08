import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getConsultations } from '../../services/consultationService'
import { Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip, CircularProgress, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store'
import { hasPermission } from '../../utils/permissions'

export default function ConsultationList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { permissions } = useAppSelector(s => s.auth)
  const canCreate = hasPermission(permissions, 'create_consultations')
  const { data, isLoading } = useQuery({ queryKey: ['consultations', page], queryFn: () => getConsultations({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'draft': return 'warning'
      case 'reviewed': return 'info'
      case 'archived': return 'default'
      default: return 'default'
    }
  }

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Consultations</Typography>
        {canCreate && (
          <Button variant="contained" component={Link} to="/consultations/new">New Consultation</Button>
        )}
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Chief Complaint</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={6}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={6}>No consultations</TableCell></TableRow>
          ) : (
            items.map((c: any) => (
              <TableRow 
                key={c.id} 
                hover 
                onClick={() => navigate(`/consultations/${c.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  {c.patient?.user ? `${c.patient.user.firstName} ${c.patient.user.lastName}` : 
                   c.patient?.firstName ? `${c.patient.firstName} ${c.patient.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {c.doctor ? `Dr. ${c.doctor.firstName} ${c.doctor.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>{c.consultationDate ? new Date(c.consultationDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell><Chip label={c.consultationType || 'routine_checkup'} size="small" /></TableCell>
                <TableCell>{c.chiefComplaint?.substring(0, 50) || '-'}{c.chiefComplaint?.length > 50 ? '...' : ''}</TableCell>
                <TableCell><Chip label={c.status} color={getStatusColor(c.status) as any} size="small" /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}