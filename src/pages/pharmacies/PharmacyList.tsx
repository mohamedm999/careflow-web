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
    Tooltip
} from '@mui/material'
import { Add, Edit, Delete, LocalPharmacy } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { getPharmacies, deletePharmacy } from '../../services/pharmacyService'
import type { Pharmacy } from '../../types/models'
import { useToast } from '../../hooks/useToast'
import PermissionGate from '../../components/common/PermissionGate'

export default function PharmacyList() {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
    const [loading, setLoading] = useState(true)
    const nav = useNavigate()
    const toast = useToast()

    const fetchPharmacies = async () => {
        try {
            setLoading(true)
            const res = await getPharmacies()
            setPharmacies(res.items)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load pharmacies')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPharmacies()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this pharmacy?')) return
        try {
            await deletePharmacy(id)
            toast.success('Pharmacy deleted successfully')
            fetchPharmacies()
        } catch (error) {
            toast.error('Failed to delete pharmacy')
        }
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalPharmacy color="primary" /> Pharmacies
                </Typography>
                <PermissionGate permission="manage_pharmacies">
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => nav('/pharmacies/new')}
                    >
                        Add Pharmacy
                    </Button>
                </PermissionGate>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Manager</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : pharmacies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No pharmacies found</TableCell>
                            </TableRow>
                        ) : (
                            pharmacies.map((pharmacy) => (
                                <TableRow key={pharmacy.id}>
                                    <TableCell>{pharmacy.name}</TableCell>
                                    <TableCell>{pharmacy.address.city}</TableCell>
                                    <TableCell>
                                        <Chip label={pharmacy.type} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={pharmacy.partnershipStatus}
                                            color={pharmacy.partnershipStatus === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{pharmacy.pharmacyManager.name}</TableCell>
                                    <TableCell align="right">
                                        <PermissionGate permission="manage_pharmacies">
                                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => nav(`/pharmacies/${pharmacy.id}/edit`)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(pharmacy.id)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
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
