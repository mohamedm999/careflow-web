import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/patients/PatientList'
import PatientCreate from './pages/patients/PatientCreate'
import PatientDetail from './pages/patients/PatientDetail'
import PatientEdit from './pages/patients/PatientEdit'
import DoctorList from './pages/doctors/DoctorList'
import DoctorCreate from './pages/doctors/DoctorCreate'
import DoctorDetail from './pages/doctors/DoctorDetail'
import DoctorEdit from './pages/doctors/DoctorEdit'
import AppointmentList from './pages/appointments/AppointmentList'
import AppointmentCreate from './pages/appointments/AppointmentCreate'
import AppointmentDetail from './pages/appointments/AppointmentDetail'
import AppointmentEdit from './pages/appointments/AppointmentEdit'
import PrescriptionList from './pages/prescriptions/PrescriptionList'
import PrescriptionCreate from './pages/prescriptions/PrescriptionCreate'
import PrescriptionDetail from './pages/prescriptions/PrescriptionDetail'
import PrescriptionEdit from './pages/prescriptions/PrescriptionEdit'
import PharmacyList from './pages/pharmacies/PharmacyList'
import PharmacyCreate from './pages/pharmacies/PharmacyCreate'
import ConsultationList from './pages/consultations/ConsultationList'
import ConsultationCreate from './pages/consultations/ConsultationCreate'
import ConsultationDetail from './pages/consultations/ConsultationDetail'
import ConsultationEdit from './pages/consultations/ConsultationEdit'
import LabOrdersList from './pages/lab/LabOrdersList'
import LabOrderCreate from './pages/lab/LabOrderCreate'
import LabOrderDetail from './pages/lab/LabOrderDetail'
import LabOrderEdit from './pages/lab/LabOrderEdit'
import LabResultsList from './pages/lab/LabResultsList'
import LabResultDetail from './pages/lab/LabResultDetail'
import DocumentList from './pages/documents/DocumentList'
import DocumentUpload from './pages/documents/DocumentUpload'
import DocumentDetail from './pages/documents/DocumentDetail'
import StaffCreate from './pages/admin/StaffCreate'
import UserList from './pages/admin/UserList'
import Settings from './pages/admin/Settings'
import PermissionsDebug from './pages/PermissionsDebug'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path=":role/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="patients" element={<ProtectedRoute element={<PatientList />} permission="view_all_patients" />} />
            <Route path="patients/new" element={<ProtectedRoute element={<PatientCreate />} permission="create_patient_records" />} />
            <Route path="patients/:id" element={<ProtectedRoute element={<PatientDetail />} permission="view_assigned_patients" />} />
            <Route path="patients/:id/edit" element={<ProtectedRoute element={<PatientEdit />} permission="view_assigned_patients" />} />
            <Route path="doctors" element={<ProtectedRoute element={<DoctorList />} permission="view_all_users" />} />
            <Route path="doctors/new" element={<ProtectedRoute element={<DoctorCreate />} permission="view_all_users" />} />
            <Route path="doctors/:id" element={<ProtectedRoute element={<DoctorDetail />} permission="view_all_users" />} />
            <Route path="doctors/:id/edit" element={<ProtectedRoute element={<DoctorEdit />} permission="view_all_users" />} />
            <Route path="appointments" element={<ProtectedRoute element={<AppointmentList />} permission="view_all_appointments" />} />
            <Route path="appointments/new" element={<ProtectedRoute element={<AppointmentCreate />} permissions={["schedule_any_doctor", "schedule_own_appointments"]} />} />
            <Route path="appointments/:id" element={<ProtectedRoute element={<AppointmentDetail />} permission="view_all_appointments" />} />
            <Route path="appointments/:id/edit" element={<ProtectedRoute element={<AppointmentEdit />} permission="view_all_appointments" />} />
            <Route path="prescriptions" element={<ProtectedRoute element={<PrescriptionList />} permission="view_all_prescriptions" />} />
            <Route path="prescriptions/new" element={<ProtectedRoute element={<PrescriptionCreate />} permission="create_prescriptions" />} />
            <Route path="prescriptions/:id" element={<ProtectedRoute element={<PrescriptionDetail />} permission="view_all_prescriptions" />} />
            <Route path="prescriptions/:id/edit" element={<ProtectedRoute element={<PrescriptionEdit />} permission="view_all_prescriptions" />} />
            <Route path="pharmacies" element={<ProtectedRoute element={<PharmacyList />} permission="view_pharmacies" />} />
            <Route path="pharmacies/new" element={<ProtectedRoute element={<PharmacyCreate />} permission="manage_pharmacies" />} />
            <Route path="consultations" element={<ProtectedRoute element={<ConsultationList />} permission="view_all_consultations" />} />
            <Route path="consultations/new" element={<ProtectedRoute element={<ConsultationCreate />} permission="create_consultations" />} />
            <Route path="consultations/:id" element={<ProtectedRoute element={<ConsultationDetail />} permission="view_all_consultations" />} />
            <Route path="consultations/:id/edit" element={<ProtectedRoute element={<ConsultationEdit />} permission="view_all_consultations" />} />
            <Route path="lab/orders" element={<ProtectedRoute element={<LabOrdersList />} permission="view_lab_orders" />} />
            <Route path="lab/orders/new" element={<ProtectedRoute element={<LabOrderCreate />} permission="create_lab_orders" />} />
            <Route path="lab/orders/:id" element={<ProtectedRoute element={<LabOrderDetail />} permission="view_lab_orders" />} />
            <Route path="lab/orders/:id/edit" element={<ProtectedRoute element={<LabOrderEdit />} permission="view_lab_orders" />} />
            <Route path="lab/results" element={<ProtectedRoute element={<LabResultsList />} permission="view_lab_results" />} />
            <Route path="lab/results/:id" element={<ProtectedRoute element={<LabResultDetail />} permission="view_lab_results" />} />
            <Route path="documents" element={<ProtectedRoute element={<DocumentList />} permissions={["view_all_documents", "view_own_documents"]} />} />
            <Route path="documents/upload" element={<ProtectedRoute element={<DocumentUpload />} permission="upload_documents" />} />
            <Route path="documents/:id" element={<ProtectedRoute element={<DocumentDetail />} permissions={["view_all_documents", "view_own_documents"]} />} />
            <Route path="admin/users" element={<ProtectedRoute element={<UserList />} permission="view_all_users" />} />
            <Route path="admin/settings" element={<ProtectedRoute element={<Settings />} permission="access_system_settings" />} />
            <Route path="admin/staff/create" element={<ProtectedRoute element={<StaffCreate />} permission="create_users" />} />
            <Route path="debug/permissions" element={<ProtectedRoute element={<PermissionsDebug />} />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}