import { Chip } from '@mui/material'

type Status = 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'draft' | 'signed' | 'dispensed' | 'pending' | 'approved' | 'rejected' | 'released' | 'in_progress' | 'active' | 'inactive'

interface StatusChipProps {
    status: Status
    size?: 'small' | 'medium'
}

const statusConfig: Record<Status, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
    scheduled: { label: 'Scheduled', color: 'info' },
    completed: { label: 'Completed', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    'no-show': { label: 'No Show', color: 'warning' },
    draft: { label: 'Draft', color: 'default' },
    signed: { label: 'Signed', color: 'primary' },
    dispensed: { label: 'Dispensed', color: 'success' },
    pending: { label: 'Pending', color: 'warning' },
    approved: { label: 'Approved', color: 'success' },
    rejected: { label: 'Rejected', color: 'error' },
    released: { label: 'Released', color: 'success' },
    in_progress: { label: 'In Progress', color: 'info' },
    active: { label: 'Active', color: 'success' },
    inactive: { label: 'Inactive', color: 'default' },
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
    const config = statusConfig[status] || { label: status, color: 'default' as const }

    return (
        <Chip
            label={config.label}
            color={config.color}
            size={size}
            sx={{ fontWeight: 500 }}
        />
    )
}
