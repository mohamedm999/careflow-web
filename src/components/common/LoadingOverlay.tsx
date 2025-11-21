import { Backdrop, CircularProgress, Typography, Box } from '@mui/material'

interface LoadingOverlayProps {
    open: boolean
    message?: string
}

export default function LoadingOverlay({ open, message = 'Loading...' }: LoadingOverlayProps) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
                gap: 2,
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6">{message}</Typography>
        </Backdrop>
    )
}
