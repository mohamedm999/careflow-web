import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
} from '@mui/material'

interface ConfirmDialogProps {
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
    confirmColor?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning'
}

export default function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'primary',
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} variant="contained" color={confirmColor} autoFocus>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
