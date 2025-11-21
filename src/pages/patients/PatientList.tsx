import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../../services/patientService'
import { TextField, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Stack, Typography, Button, CircularProgress, Box } from '@mui/material'
import { Link } from 'react-router-dom'

export default function PatientList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['patients', page, search],
    queryFn: () => getPatients({ page, limit: 10, search })
  })

  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  return (
    <Stack gap={2}>
      <Typography variant="h5">Patients</Typography>
      <Stack direction="row" gap={2} alignItems="center">
        <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" component={Link} to="/patients/new">New Patient</Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Gender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={4}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={4}>No patients</TableCell></TableRow>
          ) : (
            items.map((p) => (
              <TableRow key={p.id} hover component={Link} to={`/patients/${p.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{p.user.firstName} {p.user.lastName}</TableCell>
                <TableCell>{p.user.email}</TableCell>
                <TableCell>{p.dateOfBirth ?? '-'}</TableCell>
                <TableCell>{p.gender ?? '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}