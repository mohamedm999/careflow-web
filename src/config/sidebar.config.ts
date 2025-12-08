import {
  Dashboard,
  People,
  CalendarMonth,
  LocalHospital,
  Medication,
  LocalPharmacy,
  Science,
  Assessment,
  Folder,
  AdminPanelSettings,
  Settings,
  PersonAdd
} from '@mui/icons-material'
import type { SvgIconTypeMap } from '@mui/material'
import type { OverridableComponent } from '@mui/material/OverridableComponent'
import type { PermissionName } from '../types/permissions'

export interface SidebarItem {
  id: string
  label: string
  icon: OverridableComponent<SvgIconTypeMap>
  path: string
  permission?: PermissionName
  permissions?: PermissionName[]  // any of these
}

export const sidebarConfig: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Dashboard,
    path: '/dashboard',
    // No permission required - visible to all authenticated users
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: People,
    path: '/patients',
    permissions: ['view_all_patients', 'view_assigned_patients'],
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: CalendarMonth,
    path: '/appointments',
    permissions: ['view_all_appointments', 'view_own_appointments'],
  },
  {
    id: 'consultations',
    label: 'Consultations',
    icon: LocalHospital,
    path: '/consultations',
    permission: 'view_all_consultations',
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    icon: Medication,
    path: '/prescriptions',
    permission: 'view_all_prescriptions',
  },
  {
    id: 'pharmacies',
    label: 'Pharmacies',
    icon: LocalPharmacy,
    path: '/pharmacies',
    permission: 'view_pharmacies',
  },
  {
    id: 'lab-orders',
    label: 'Lab Orders',
    icon: Science,
    path: '/lab/orders',
    permission: 'view_lab_orders',
  },
  {
    id: 'lab-results',
    label: 'Lab Results',
    icon: Assessment,
    path: '/lab/results',
    permission: 'view_lab_results',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: Folder,
    path: '/documents',
    permissions: ['view_all_documents', 'view_own_documents'],
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: AdminPanelSettings,
    path: '/admin/users',
    permission: 'create_users',
  },
  {
    id: 'create-staff',
    label: 'Create Staff',
    icon: PersonAdd,
    path: '/admin/staff/create',
    permission: 'create_users',
  },
  // Settings hidden - backend not implemented yet
  // {
  //   id: 'settings',
  //   label: 'Settings',
  //   icon: Settings,
  //   path: '/admin/settings',
  //   permission: 'access_system_settings',
  // },
]
