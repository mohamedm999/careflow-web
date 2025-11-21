import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getConsultations } from '../../services/consultationService'
import { Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip } from '@mui/material'
import { Link } from 'react-router-dom'

export default function ConsultationList() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['consultations', page], queryFn: () => getConsultations({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  return (
    <Stack gap={2}>
      <Typography variant="h5">Consultations</Typography>
      <Button variant="contained" component={Link} to="/consultations/new">New Consultation</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={4}>No consultations</TableCell></TableRow>
          ) : (
            items.map(c => (
              <TableRow key={c.id} hover component={Link} to={`/consultations/${c.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{c.patientId}</TableCell>
                <TableCell>{c.doctorId}</TableCell>
                <TableCell>{c.date}</TableCell>
                <TableCell><Chip label={c.status} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}