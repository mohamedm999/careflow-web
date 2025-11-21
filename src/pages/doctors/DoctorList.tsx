import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDoctors } from '../../services/doctorService'
import { TextField, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Stack, Typography, Button, CircularProgress, Box } from '@mui/material'
import { Link } from 'react-router-dom'

export default function DoctorList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['doctors', page, search],
    queryFn: () => getDoctors({ page, limit: 10, search })
  })

  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  return (
    <Stack gap={2}>
      <Typography variant="h5">Doctors</Typography>
      <Stack direction="row" gap={2} alignItems="center">
        <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" component={Link} to="/doctors/new">New Doctor</Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>License Number</TableCell>
            <TableCell>Experience</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={5}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={5}>No doctors</TableCell></TableRow>
          ) : (
            items.map((d) => (
              <TableRow key={d.id} hover component={Link} to={`/doctors/${d.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{d.user.firstName} {d.user.lastName}</TableCell>
                <TableCell>{d.user.email}</TableCell>
                <TableCell>{d.specialization ?? '-'}</TableCell>
                <TableCell>{d.licenseNumber ?? '-'}</TableCell>
                <TableCell>{d.yearsOfExperience ? `${d.yearsOfExperience} years` : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}
