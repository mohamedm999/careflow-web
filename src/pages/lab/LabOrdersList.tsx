import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLabOrders } from '../../services/labOrderService'
import { Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip } from '@mui/material'
import { Link } from 'react-router-dom'

export default function LabOrdersList() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['labOrders', page], queryFn: () => getLabOrders({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1
  return (
    <Stack gap={2}>
      <Typography variant="h5">Lab Orders</Typography>
      <Button variant="contained" component={Link} to="/lab/orders/new">New Lab Order</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={3}>No lab orders</TableCell></TableRow>
          ) : (
            items.map(o => (
              <TableRow key={o.id} hover component={Link} to={`/lab/orders/${o.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{o.patientId}</TableCell>
                <TableCell>{o.doctorId}</TableCell>
                <TableCell><Chip label={o.status} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}