import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { logout } from '../store/slices/authSlice'

export default function MainLayout() {
  const loc = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(s => s.auth.user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const onLogout = async () => {
    try { await dispatch(logout()).unwrap() } finally { navigate('/auth/login') }
  }
  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>CareFlow EHR</Typography>
          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar>{user?.firstName?.[0] ?? '?'}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>{user ? `${user.firstName} ${user.lastName}` : 'User'}</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: 240, ['& .MuiDrawer-paper']: { width: 240, mt: 8 } }}>
        <List>
          <ListItemButton component={Link} to="/dashboard" selected={loc.pathname.startsWith('/dashboard')}>Dashboard</ListItemButton>
          <ListItemButton component={Link} to="/patients" selected={loc.pathname.startsWith('/patients')}>Patients</ListItemButton>
          <ListItemButton component={Link} to="/doctors" selected={loc.pathname.startsWith('/doctors')}>Doctors</ListItemButton>
          <ListItemButton component={Link} to="/appointments" selected={loc.pathname.startsWith('/appointments')}>Appointments</ListItemButton>
          <ListItemButton component={Link} to="/prescriptions" selected={loc.pathname.startsWith('/prescriptions')}>Prescriptions</ListItemButton>
          <ListItemButton component={Link} to="/consultations" selected={loc.pathname.startsWith('/consultations')}>Consultations</ListItemButton>
          <ListItemButton component={Link} to="/lab/orders" selected={loc.pathname.startsWith('/lab')}>Lab</ListItemButton>
          <ListItemButton component={Link} to="/documents" selected={loc.pathname.startsWith('/documents')}>Documents</ListItemButton>
        </List>
      </Drawer>
      <main style={{ flex: 1, padding: 24, marginTop: 64, marginLeft: 240 }}>
        <Outlet />
      </main>
    </div>
  )
}