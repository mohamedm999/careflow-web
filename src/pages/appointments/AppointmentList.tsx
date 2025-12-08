import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAppointments } from '../../services/appointmentService'
import { TextField, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Stack, Typography, Button, Select, MenuItem, Chip, CircularProgress, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../store'
import { hasAnyPermission } from '../../utils/permissions'

export default function AppointmentList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const { permissions } = useAppSelector(s => s.auth)
  const canCreate = hasAnyPermission(permissions, ['schedule_any_doctor', 'schedule_own_appointments'])
  
  const { data, isLoading } = useQuery({
    queryKey: ['appointments', page, search, status, type],
    queryFn: () => getAppointments({ page, limit: 10 })
  })

  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1

  return (
    <Stack gap={2}>
      <Typography variant="h5">Appointments</Typography>
      <Stack direction="row" gap={2} alignItems="center">
        <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} displayEmpty onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="">All Status</MenuItem>
          {['scheduled','completed','cancelled','no-show'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
        <Select value={type} displayEmpty onChange={(e) => setType(e.target.value)}>
          <MenuItem value="">All Types</MenuItem>
          {['consultation','checkup','procedure','follow-up'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
        {canCreate && (
          <Button variant="contained" component={Link} to="/appointments/new">New Appointment</Button>
        )}
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={6}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={6}>No appointments</TableCell></TableRow>
          ) : (
            items.map((a: any) => (
              <TableRow 
                key={a.id} 
                hover
              >
                <TableCell>
                  {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Unknown Patient'}
                </TableCell>
                <TableCell>
                  {a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : 'Unknown Doctor'}
                </TableCell>
                <TableCell>{new Date(a.dateTime).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell><Chip label={a.type} /></TableCell>
                <TableCell>
                  <Chip label={a.status} color={a.status === 'scheduled' ? 'primary' : a.status === 'completed' ? 'success' : 'default'} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}