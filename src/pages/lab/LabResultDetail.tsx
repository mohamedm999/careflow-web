import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLabResultById } from '../../services/labResultService'
import { Stack, Typography, Button, Paper, Chip, CircularProgress, Box, Container } from '@mui/material'

export default function LabResultDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey: ['labResult', id], queryFn: () => getLabResultById(id!) })

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><CircularProgress /></Container>
  if (!data) return <Container><Typography variant="h6" color="error">Lab result not found</Typography></Container>

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      pending: 'info',
      completed: 'success',
      approved: 'success',
      released: 'success',
      rejected: 'error'
    }
    return colors[status] || 'default'
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Lab Result Details</Typography>
            <Chip label={data.status} color={getStatusColor(data.status)} variant="outlined" />
          </Box>

          <Stack gap={2}>
            <Box>
              <Typography variant="caption" color="textSecondary">Lab Order ID</Typography>
              <Typography variant="body1">{data.labOrderId}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Test Type</Typography>
              <Typography variant="body1">{data.testType ?? '-'}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">Result Date</Typography>
              <Typography variant="body1">{data.resultDate ? new Date(data.resultDate).toLocaleDateString() : '-'}</Typography>
            </Box>

            {data.values && (
              <Box>
                <Typography variant="caption" color="textSecondary">Result Values</Typography>
                <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {typeof data.values === 'string' ? data.values : JSON.stringify(data.values, null, 2)}
                </Typography>
              </Box>
            )}

            {data.notes && (
              <Box>
                <Typography variant="caption" color="textSecondary">Notes</Typography>
                <Typography variant="body1">{data.notes}</Typography>
              </Box>
            )}

            {data.normalRange && (
              <Box>
                <Typography variant="caption" color="textSecondary">Normal Range</Typography>
                <Typography variant="body1">{data.normalRange}</Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}