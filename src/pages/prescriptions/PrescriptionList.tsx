import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPrescriptions } from '../../services/prescriptionService'
import { Stack, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip } from '@mui/material'
import { Link } from 'react-router-dom'

export default function PrescriptionList() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['prescriptions', page], queryFn: () => getPrescriptions({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

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
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={4}>No prescriptions</TableCell></TableRow>
          ) : (
            items.map(p => (
              <TableRow key={p.id} hover component={Link} to={`/prescriptions/${p.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{p.patientId}</TableCell>
                <TableCell>{p.doctorId}</TableCell>
                <TableCell><Chip label={p.status} /></TableCell>
                <TableCell>{p.startDate}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}