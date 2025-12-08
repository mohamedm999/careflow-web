import { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material'
import { Add, Edit, Block, CheckCircle, AdminPanelSettings } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, toggleUserStatus } from '../../services/userService'
import type { User } from '../../types/models'
import { useToast } from '../../hooks/useToast'
import PermissionGate from '../../components/common/PermissionGate'

export default function UserList() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const nav = useNavigate()
    const toast = useToast()

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await getAllUsers()
            setUsers(res?.items ?? [])
        } catch (error: any) {
            console.error(error)
            setUsers([])
            if (error.response?.status === 404) {
                setError('User management endpoint not found in backend.')
            } else {
                toast.error('Failed to load users')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (user: User) => {
        try {
            await toggleUserStatus(user.id, !user.isActive)
            toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
            fetchUsers()
        } catch (error) {
            toast.error('Failed to update user status')
        }
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettings color="primary" /> User Management
                </Typography>
                <PermissionGate permission="create_users">
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => nav('/admin/staff/create')}
                    >
                        Create Staff
                    </Button>
                </PermissionGate>
            </Stack>

            {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No users found</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip label={user.role?.name || 'N/A'} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.isActive ? 'Active' : 'Inactive'}
                                            color={user.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <PermissionGate permission="suspend_activate_accounts">
                                            <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                                                <IconButton
                                                    size="small"
                                                    color={user.isActive ? "error" : "success"}
                                                    onClick={() => handleToggleStatus(user)}
                                                >
                                                    {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        </PermissionGate>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
