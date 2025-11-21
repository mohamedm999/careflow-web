# CareFlow-Web Frontend

> Modern Electronic Health Record (EHR) System Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- npm v8+ installed
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

## 🔧 Environment Configuration

Create a `.env.development` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
NODE_ENV=development
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://api.careflow.com/api/v1
VITE_API_TIMEOUT=30000
NODE_ENV=production
```

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Query (TanStack)** - Server state management
- **React Router v6** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

## 📂 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Toaster.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── StatusChip.tsx
│   │   ├── EmptyState.tsx
│   │   └── PageHeader.tsx
│   └── ErrorBoundary.tsx
├── hooks/                # Custom React hooks
│   └── useToast.ts
├── layouts/              # Layout components
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── pages/                # Page components (32 pages)
│   ├── auth/
│   ├── patients/
│   ├── doctors/
│   ├── appointments/
│   ├── prescriptions/
│   ├── consultations/
│   ├── lab/
│   ├── documents/
│   ├── Dashboard.tsx
│   └── AccessDenied.tsx
├── routes/               # Route protection
│   └── ProtectedRoute.tsx
├── services/             # API services (10 services)
│   ├── api.ts
│   ├── token.ts
│   ├── patientService.ts
│   ├── doctorService.ts
│   ├── appointmentService.ts
│   └── ...
├── store/                # Redux store
│   ├── index.ts
│   └── slices/
│       └── authSlice.ts
├── theme/                # MUI theme
│   └── index.ts
├── types/                # TypeScript types
│   ├── api.ts
│   └── models.ts
├── utils/                # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── App.tsx               # Main app component
└── main.tsx              # Entry point
```

## 🔐 Authentication

The application uses JWT-based authentication:
- **Access Token**: 15-30 min lifetime, stored in memory
- **Refresh Token**: 7 days lifetime, stored in HttpOnly cookie
- **Auto-refresh**: Automatic token refresh on expiration

## 🎨 Features

### Core Features
- ✅ User authentication (login/register/logout)
- ✅ Role-based access control (7 roles)
- ✅ Patient management (CRUD)
- ✅ Doctor management (CRUD)
- ✅ Appointment scheduling (CRUD)
- ✅ Prescription management (CRUD)
- ✅ Consultation records (CRUD)
- ✅ Lab orders and results
- ✅ Document management with upload

### UI/UX Features
- ✅ Toast notifications (success, error, info)
- ✅ Error boundary for crash recovery
- ✅ Loading overlays and states
- ✅ Confirmation dialogs
- ✅ Status chips with color coding
- ✅ Empty states
- ✅ Breadcrumb navigation
- ✅ Responsive design
- ✅ Custom Material-UI theme

### Developer Features
- ✅ TypeScript with strict mode
- ✅ ESLint configuration
- ✅ Hot module replacement
- ✅ Utility functions (formatters, validators)
- ✅ Constants for app-wide values
- ✅ Error handling with user-friendly messages

## 🧪 Development

### TypeScript Check
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📝 Code Style

- Use TypeScript for all new files
- Follow React hooks best practices
- Use React Hook Form for forms
- Use Zod for validation schemas
- Use React Query for API calls
- Use Redux for global state (auth, UI state)
- Components should be in PascalCase
- Utilities should be in camelCase

## 🚦 Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap with `<ProtectedRoute>` if auth required
4. Add to navigation in `MainLayout.tsx`

### Adding a New API Service
1. Create service file in `src/services/`
2. Follow pattern from existing services
3. Use `http` instance from `api.ts`
4. Return type-safe data

### Using Toast Notifications
```typescript
import { useToast } from '../hooks/useToast'

const toast = useToast()

toast.success('Operation successful!')
toast.error('Something went wrong')
toast.info('Informational message')
const loadingId = toast.loading('Processing...')
toast.dismiss(loadingId)
```

### Using Confirmation Dialog
```typescript
import { useState } from 'react'
import ConfirmDialog from '../components/common/ConfirmDialog'

const [open, setOpen] = useState(false)

<ConfirmDialog
  open={open}
  title="Delete Patient"
  message="Are you sure you want to delete this patient?"
  onConfirm={() => { /* handle delete */ }}
  onCancel={() => setOpen(false)}
  confirmColor="error"
  confirmText="Delete"
/>
```

## 🔗 Backend Integration

This frontend integrates with the **CareFlow-EHR Backend** (Node.js/Express).

**Backend Repository Documentation:**
- See `repo.md` for backend architecture
- See `BACKEND_FRONTEND_INTEGRATION.md` for integration details
- See `API_ENDPOINTS.md` for API reference

## 📄 License

Private - All rights reserved

## 👥 Support

For issues or questions, contact the development team.

---

**Last Updated:** January 19, 2025  
**Version:** 1.0.0
