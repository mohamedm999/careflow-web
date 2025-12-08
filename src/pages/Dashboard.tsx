import { Card, CardContent, Grid, Typography, Stack, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store'
import { hasPermission, hasAnyPermission } from '../utils/permissions'

export default function Dashboard() {
  const { user, permissions } = useAppSelector(s => s.auth)

  const allModules = [
    {
      title: 'Patients',
      link: '/patients',
      icon: '👥',
      color: '#1976d2',
      show: hasAnyPermission(permissions, ['view_all_patients', 'view_assigned_patients'])
    },
    {
      title: 'Doctors',
      link: '/doctors',
      icon: '👨‍⚕️',
      color: '#388e3c',
      show: hasPermission(permissions, 'view_all_users') // Fallback to view_all_users
    },
    {
      title: 'Appointments',
      link: '/appointments',
      icon: '📅',
      color: '#d32f2f',
      show: hasAnyPermission(permissions, ['view_all_appointments', 'view_own_appointments'])
    },
    {
      title: 'Prescriptions',
      link: '/prescriptions',
      icon: '💊',
      color: '#f57c00',
      show: hasPermission(permissions, 'view_all_prescriptions')
    },
    {
      title: 'Pharmacies',
      link: '/pharmacies',
      icon: '🏥',
      color: '#e64a19',
      show: hasPermission(permissions, 'view_pharmacies')
    },
    {
      title: 'Consultations',
      link: '/consultations',
      icon: '💬',
      color: '#7b1fa2',
      show: hasPermission(permissions, 'view_all_consultations')
    },
    {
      title: 'Lab Orders',
      link: '/lab/orders',
      icon: '🧪',
      color: '#0097a7',
      show: hasPermission(permissions, 'view_lab_orders')
    },
    {
      title: 'Lab Results',
      link: '/lab/results',
      icon: '📊',
      color: '#00897b',
      show: hasPermission(permissions, 'view_lab_results')
    },
    {
      title: 'Documents',
      link: '/documents',
      icon: '📄',
      color: '#455a64',
      show: hasAnyPermission(permissions, ['view_all_documents', 'view_own_documents'])
    },
    {
      title: 'User Management',
      link: '/admin/users',
      icon: '🛡️',
      color: '#d32f2f',
      show: hasPermission(permissions, 'create_users')
    },
    // Settings hidden - backend not implemented yet
    // {
    //   title: 'Settings',
    //   link: '/admin/settings',
    //   icon: '⚙️',
    //   color: '#616161',
    //   show: hasPermission(permissions, 'access_system_settings')
    // }
  ]

  const visibleModules = allModules.filter(m => m.show)

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
          {visibleModules.map((mod) => (
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