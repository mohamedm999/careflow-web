import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLabOrders } from '../../services/labOrderService'
import { Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip, CircularProgress, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function LabOrdersList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['labOrders', page], queryFn: () => getLabOrders({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'warning'
      case 'collected': return 'info'
      case 'received': return 'info'
      case 'in_progress': return 'primary'
      case 'completed': return 'success'
      case 'validated': return 'success'
      case 'reported': return 'success'
      case 'cancelled': return 'error'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  return (
    <Stack gap={2}>
      <Typography variant="h5">Lab Orders</Typography>
      <Button variant="contained" component={Link} to="/lab/orders/new">New Lab Order</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Tests</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={7}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={7}>No lab orders</TableCell></TableRow>
          ) : (
            items.map((o: any) => (
              <TableRow 
                key={o.id} 
                hover 
                onClick={() => navigate(`/lab/orders/${o.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{o.orderNumber || '-'}</TableCell>
                <TableCell>
                  {o.patient?.user ? `${o.patient.user.firstName} ${o.patient.user.lastName}` :
                   o.patient?.firstName ? `${o.patient.firstName} ${o.patient.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {o.doctor ? `Dr. ${o.doctor.firstName} ${o.doctor.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>{o.tests?.length || 0} test(s)</TableCell>
                <TableCell><Chip label={o.priority || 'routine'} size="small" /></TableCell>
                <TableCell><Chip label={o.status} color={getStatusColor(o.status) as any} size="small" /></TableCell>
                <TableCell>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}