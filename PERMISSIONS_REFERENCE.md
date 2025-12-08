# Permission System - Quick Reference

## Permission Names (80 total)

### User Management (4)
- `create_users`
- `view_all_users`
- `modify_user_roles`
- `suspend_activate_accounts`

### Patient Records (5)
- `create_patient_records`
- `view_all_patients`
- `view_assigned_patients`
- `edit_medical_history`
- `view_own_record`

### Appointments (7)
- `view_all_appointments`
- `view_own_appointments`
- `schedule_any_doctor`
- `schedule_own_appointments`
- `cancel_any_appointment`
- `cancel_own_appointments`
- `mark_appointment_complete`

### Consultations (5)
- `create_consultations`
- `view_all_consultations`
- `view_own_consultations`
- `edit_consultations`
- `delete_consultations`

### Prescriptions (6)
- `create_prescriptions`
- `view_all_prescriptions`
- `view_own_prescriptions`
- `sign_prescriptions`
- `send_prescriptions`
- `dispense_prescriptions`

### Pharmacy (4)
- `manage_pharmacies`
- `view_pharmacies`
- `view_assigned_prescriptions`
- `update_prescription_status`

### Laboratory (16)
- `create_lab_orders`
- `view_lab_orders`
- `view_all_lab_orders`
- `view_own_lab_orders`
- `edit_lab_orders`
- `cancel_lab_orders`
- `collect_specimens`
- `receive_specimens`
- `update_lab_order_status`
- `create_lab_results`
- `view_lab_results`
- `edit_lab_results`
- `upload_lab_results`
- `validate_lab_results`
- `upload_lab_reports`
- `download_lab_reports`

### Documents (7)
- `upload_documents`
- `view_all_documents`
- `view_own_documents`
- `edit_documents`
- `delete_documents`
- `download_documents`
- `share_documents`

### System Management (4)
- `access_system_settings`
- `view_system_logs`
- `configure_notifications`
- `export_import_data`

---

## Role Names (7)

- `admin` - Administrator with full access
- `doctor` - Medical practitioner
- `nurse` - Clinical staff
- `secretary` - Front desk staff
- `patient` - End user
- `pharmacist` - Pharmacy staff
- `lab_technician` - Laboratory staff

---

## Quick Usage Examples

### Using Constants

```typescript
import { PERMISSIONS, ROLES } from '@/utils/permissionConstants'

<ProtectedRoute 
  permission={PERMISSIONS.USER_MANAGEMENT.CREATE_USERS} 
  element={<CreateUser />} 
/>
```

### Using Hooks

```typescript
import { usePermission, useHasRole } from '@/hooks/usePermission'

const canCreate = usePermission('create_patient_records')
const isAdmin = useHasRole('admin')
```

### Using Components

```typescript
// Permission-based
<PermissionGate permission="create_users">
  <CreateButton />
</PermissionGate>

// Role-based
<RoleGate role="admin">
  <AdminPanel />
</RoleGate>
```

### Route Protection

```typescript
// Permission-based
<ProtectedRoute 
  element={<PatientList />}
  permission="view_all_patients" 
/>

// Role-based
<ProtectedRoute 
  element={<AdminPanel />}
  role="admin" 
/>
```

---

## Common Patterns

### Check Multiple Permissions (OR)

```typescript
// Any one permission is enough
const canView = usePermissions(
  ['view_all_patients', 'view_assigned_patients'],
  'any'
)
```

### Check Multiple Permissions (AND)

```typescript
// All permissions required
const canManage = usePermissions(
  ['view_lab_orders', 'edit_lab_orders'],
  'all'
)

// Or in components:
<PermissionGate 
  permissions={['view_lab_orders', 'edit_lab_orders']}
  requireAll
>
  <LabManagement />
</PermissionGate>
```

### Check Multiple Roles

```typescript
const isMedicalStaff = useHasAnyRole(['doctor', 'nurse'])

// Or in components:
< RoleGate roles={['doctor', 'nurse']}>
  <MedicalDashboard />
</RoleGate>
```

---

## Import Patterns

### Individual Imports

```typescript
import { PERMISSIONS } from '@/utils/permissionConstants'
import { usePermission } from '@/hooks/usePermission'
import { hasPermission } from '@/utils/permissions'
import PermissionGate from '@/components/common/PermissionGate'
```

### Barrel Import (Recommended)

```typescript
import { 
  PERMISSIONS,
  usePermission,
  hasPermission,
  PermissionGate 
} from '@/permissions'
```

---

## TypeScript Types

```typescript
import type { 
  PermissionName,
  RoleName,
  PermissionCategory 
} from '@/types/permissions'

// Function parameter with autocomplete
function checkPermission(perm: PermissionName) {
  // IDE will suggest all 80 valid permission names
}
```
