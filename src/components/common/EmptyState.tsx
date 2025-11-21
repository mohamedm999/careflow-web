import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 3,
                textAlign: 'center',
            }}
        >
            {icon && (
                <Box sx={{ fontSize: 64, mb: 2, opacity: 0.5 }}>
                    {icon}
                </Box>
            )}
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
            </Typography>
            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                    {description}
                </Typography>
            )}
            {action && <Box>{action}</Box>}
        </Box>
    )
}
