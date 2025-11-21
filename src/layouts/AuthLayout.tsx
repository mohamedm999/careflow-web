import { Outlet } from 'react-router-dom'
import { Container, Paper, Typography } from '@mui/material'

export default function AuthLayout() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Welcome to CareFlow</Typography>
        <Outlet />
      </Paper>
    </Container>
  )
}