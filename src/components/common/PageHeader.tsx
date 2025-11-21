import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface PageHeaderProps {
    title: string
    subtitle?: string
    action?: ReactNode
    breadcrumbs?: { label: string; to?: string }[]
}

export default function PageHeader({ title, subtitle, action, breadcrumbs }: PageHeaderProps) {
    return (
        <Box sx={{ mb: 3 }}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs sx={{ mb: 1 }}>
                    {breadcrumbs.map((crumb, index) =>
                        crumb.to ? (
                            <MuiLink
                                key={index}
                                component={Link}
                                to={crumb.to}
                                underline="hover"
                                color="inherit"
                            >
                                {crumb.label}
                            </MuiLink>
                        ) : (
                            <Typography key={index} color="text.primary">
                                {crumb.label}
                            </Typography>
                        )
                    )}
                </Breadcrumbs>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" gutterBottom={!!subtitle}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action && <Box>{action}</Box>}
            </Box>
        </Box>
    )
}
