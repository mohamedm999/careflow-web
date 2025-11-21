import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatientById, deletePatient } from '../../services/patientService'
import { Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState } from 'react'

export default function PatientDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['patient', id], queryFn: () => getPatientById(id!) })
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Not found</div>

  return (
    <Stack gap={2}>
      <Typography variant="h5">Patient Detail</Typography>
      <Typography>Name: {data.user.firstName} {data.user.lastName}</Typography>
      <Typography>Email: {data.user.email}</Typography>
      <Typography>DOB: {data.dateOfBirth ?? '-'}</Typography>
      <Typography>Gender: {data.gender ?? '-'}</Typography>
      <Button variant="outlined" component={Link} to={`/patients/${id}/edit`}>Edit</Button>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>Delete</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete this patient?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="error" onClick={async () => { await deletePatient(id!); navigate('/patients') }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}