import { Component, ReactNode } from 'react'
import { Box, Button, Paper, Typography, Container } from '@mui/material'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        window.location.href = '/dashboard'
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm" sx={{ mt: 8 }}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" color="error" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the dashboard.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button variant="contained" onClick={this.handleReset}>
                                Go to Dashboard
                            </Button>
                            <Button variant="outlined" onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                        </Box>
                        {this.state.error && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
                                <Typography variant="caption" component="pre" sx={{ overflow: 'auto' }}>
                                    {this.state.error.toString()}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Container>
            )
        }

        return this.props.children
    }
}
