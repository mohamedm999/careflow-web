import { Card, CardContent, Grid, Typography, Stack, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store'

export default function Dashboard() {
  const user = useAppSelector(s => s.auth.user)

  const modules = [
    { title: 'Patients', link: '/patients', icon: '👥', color: '#1976d2' },
    { title: 'Doctors', link: '/doctors', icon: '👨‍⚕️', color: '#388e3c' },
    { title: 'Appointments', link: '/appointments', icon: '📅', color: '#d32f2f' },
    { title: 'Prescriptions', link: '/prescriptions', icon: '💊', color: '#f57c00' },
    { title: 'Consultations', link: '/consultations', icon: '💬', color: '#7b1fa2' },
    { title: 'Lab Orders', link: '/lab/orders', icon: '🧪', color: '#0097a7' },
    { title: 'Lab Results', link: '/lab/results', icon: '📊', color: '#00897b' },
    { title: 'Documents', link: '/documents', icon: '📄', color: '#455a64' }
  ]

  return (
    <Stack gap={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          EHR System • Role: {user?.role?.name?.toUpperCase()}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          {modules.map((mod) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mod.link}>
              <Card
                component={Link}
                to={mod.link}
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  },
                  borderLeft: `4px solid ${mod.color}`
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 32, mb: 1 }}>{mod.icon}</Typography>
                  <Typography variant="h6" color="primary">
                    {mod.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Card sx={{ backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Stack gap={1}>
            <Typography variant="body2">✅ Backend connected</Typography>
            <Typography variant="body2">✅ Authentication active</Typography>
            <Typography variant="body2">✅ Database synchronized</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}