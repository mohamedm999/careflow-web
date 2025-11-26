import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Grid,
    MenuItem
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { createPharmacy } from '../../services/pharmacyService'
import { useToast } from '../../hooks/useToast'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    licenseNumber: z.string().min(1, 'License number is required'),
    type: z.enum(['community', 'hospital', 'clinic', 'online', 'specialty']),
    address: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().default('Morocco')
    }),
    pharmacyManager: z.object({
        name: z.string().min(1, 'Manager name is required'),
        licenseNumber: z.string().min(1, 'Manager license is required'),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional()
    })
})

type FormData = z.infer<typeof schema>

export default function PharmacyCreate() {
    const nav = useNavigate()
    const toast = useToast()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: 'community',
            address: { country: 'Morocco' }
        }
    })

    const onSubmit = async (data: FormData) => {
        try {
            await createPharmacy({
                ...data,
                isActive: true,
                partnershipStatus: 'active',
                contacts: [], // Required by type but not in form for simplicity
                openingHours: [], // Required by type but not in form for simplicity
                services: [] // Required by type but not in form for simplicity
            })
            toast.success('Pharmacy created successfully')
            nav('/pharmacies')
        } catch (error) {
            toast.error('Failed to create pharmacy')
        }
    }

    return (
        <Box maxWidth="lg" mx="auto">
            <Typography variant="h5" mb={3}>Add New Pharmacy</Typography>
            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Basic Information</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Pharmacy Name"
                                {...register('name')}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Type"
                                {...register('type')}
                                error={!!errors.type}
                                helperText={errors.type?.message}
                                defaultValue="community"
                            >
                                {['community', 'hospital', 'clinic', 'online', 'specialty'].map(t => (
                                    <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="License Number"
                                {...register('licenseNumber')}
                                error={!!errors.licenseNumber}
                                helperText={errors.licenseNumber?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Address</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Street"
                                {...register('address.street')}
                                error={!!errors.address?.street}
                                helperText={errors.address?.street?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="City"
                                {...register('address.city')}
                                error={!!errors.address?.city}
                                helperText={errors.address?.city?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                {...register('address.postalCode')}
                                error={!!errors.address?.postalCode}
                                helperText={errors.address?.postalCode?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Manager Information</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Manager Name"
                                {...register('pharmacyManager.name')}
                                error={!!errors.pharmacyManager?.name}
                                helperText={errors.pharmacyManager?.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Manager License"
                                {...register('pharmacyManager.licenseNumber')}
                                error={!!errors.pharmacyManager?.licenseNumber}
                                helperText={errors.pharmacyManager?.licenseNumber?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Manager Email"
                                {...register('pharmacyManager.email')}
                                error={!!errors.pharmacyManager?.email}
                                helperText={errors.pharmacyManager?.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Manager Phone"
                                {...register('pharmacyManager.phone')}
                                error={!!errors.pharmacyManager?.phone}
                                helperText={errors.pharmacyManager?.phone?.message}
                            />
                        </Grid>
                    </Grid>

                    <Stack direction="row" justifyContent="flex-end" gap={2} mt={4}>
                        <Button onClick={() => nav('/pharmacies')}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Pharmacy'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}
