import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { logout } from '../store/slices/authSlice'
import { sidebarConfig } from '../config/sidebar.config'
import { hasPermission, hasAnyPermission } from '../utils/permissions'

export default function MainLayout() {
  const loc = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, permissions } = useAppSelector(s => s.auth)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const onLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
    } finally {
      navigate('/auth/login')
    }
  }

  // Filter sidebar items based on permissions
  const visibleItems = sidebarConfig.filter(item => {
    // No permission required - show to everyone
    if (!item.permission && !item.permissions) return true

    // Multiple permissions (OR logic)
    if (item.permissions) {
      return hasAnyPermission(permissions, item.permissions)
    }

    // Single permission check
    if (item.permission) {
      return hasPermission(permissions, item.permission)
    }

    return false
  })

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
              <MenuItem disabled sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {user?.role?.name}
              </MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, mt: 8 } }}>
        <List>
          {visibleItems.map((item) => (
            <ListItemButton
              key={item.id}
              component={Link}
              to={item.path}
              selected={loc.pathname === item.path || loc.pathname.startsWith(item.path + '/')}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <main style={{ flex: 1, padding: 24, marginTop: 64, marginLeft: 240 }}>
        <Outlet />
      </main>
    </div>
  )
}