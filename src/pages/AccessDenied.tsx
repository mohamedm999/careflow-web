import { Container, Paper, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Lock } from '@mui/icons-material'

export default function AccessDenied() {
    const navigate = useNavigate()

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                    <Lock sx={{ fontSize: 80, color: 'error.main', opacity: 0.5 }} />
                </Box>
                <Typography variant="h4" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}
