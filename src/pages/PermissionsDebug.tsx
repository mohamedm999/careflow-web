import { useAppSelector } from '../store'
import { Box, Paper, Typography, List, ListItem, Chip, Alert } from '@mui/material'

export default function PermissionsDebug() {
    const { user, permissions, isAuthenticated } = useAppSelector(s => s.auth)

    return (
        <Box maxWidth="md" mx="auto" mt={4}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    🔍 Permission Debugger
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    This page shows your current permissions. If empty, try logging out and back in.
                </Alert>

                <Box mb={3}>
                    <Typography variant="h6">User Info:</Typography>
                    <Typography>Name: {user?.firstName} {user?.lastName}</Typography>
                    <Typography>Email: {user?.email}</Typography>
                    <Typography>Role: {user?.role?.name}</Typography>
                    <Typography>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</Typography>
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Permissions ({permissions.length}):
                    </Typography>

                    {permissions.length === 0 ? (
                        <Alert severity="warning">
                            ⚠️ No permissions found! You need to:
                            <ol>
                                <li>Log out</li>
                                <li>Log back in</li>
                                <li>Check this page again</li>
                            </ol>
                        </Alert>
                    ) : (
                        <List>
                            {permissions.map((perm, idx) => (
                                <ListItem key={idx}>
                                    <Chip
                                        label={perm.name}
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {perm.category} - {perm.description}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Check Specific Permissions:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {['create_consultations', 'view_all_consultations', 'create_prescriptions', 'view_all_patients', 'create_lab_orders', 'upload_documents'].map((permName) => {
                            const has = permissions.some(p => p.name === permName)
                            return (
                                <Chip
                                    key={permName}
                                    label={permName}
                                    color={has ? 'success' : 'default'}
                                    variant={has ? 'filled' : 'outlined'}
                                    icon={has ? <>✓</> : <>✗</>}
                                />
                            )
                        })}
                    </Box>
                </Box>

                <Alert severity="success">
                    If you see permissions here but not in the dashboard, clear your browser cache and refresh.
                </Alert>
            </Paper>
        </Box>
    )
}
