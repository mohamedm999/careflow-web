export interface Permission { id: string; name: string; description?: string; category: string }
export interface Role { id: string; name: string; permissions: Permission[] }
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  disabledPermissions?: Permission[]
  isActive: boolean
}

export interface Allergy { allergen: string; severity: 'mild' | 'moderate' | 'severe'; notes?: string; addedDate?: string }
export interface MedicalHistory { condition: string; diagnosedDate?: string; status: 'active' | 'resolved' | 'chronic'; notes?: string }

export interface Doctor {
  id: string
  user: User
  specialization?: string
  licenseNumber?: string
  yearsOfExperience?: number
  createdAt?: string
  updatedAt?: string
}

export interface Patient {
  id: string
  user: User
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown'
  allergies: Allergy[]
  medicalHistory: MedicalHistory[]
  createdAt?: string
  updatedAt?: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  type: 'consultation' | 'checkup' | 'procedure' | 'follow-up'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  reasonForVisit?: string
  notes?: string
  location?: string
  createdAt?: string
  updatedAt?: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  medications: { medicationName: string; dosage: string; frequency?: string; duration?: string }[]
  status: 'draft' | 'signed' | 'dispensed' | 'completed' | 'cancelled'
  instructions?: string
  notes?: string
  startDate: string
  endDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface Consultation {
  id: string
  patientId: string
  doctorId: string
  date: string
  status: 'draft' | 'completed' | 'cancelled'
  chiefComplaint?: string
  assessment?: string
  plan?: string
  diagnosis?: string
  treatmentPlan?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface LabOrder {
  id: string
  patientId: string
  doctorId: string
  tests: { testName: string; testCode?: string }[]
  status: 'pending' | 'approved' | 'rejected' | 'sample_collected' | 'in_progress' | 'completed' | 'cancelled'
  testType?: string
  sampleType?: string
  collectionDate?: string
  scheduledDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface LabResult {
  id: string
  labOrderId: string
  results: { testName: string; result: string | number; unit?: string; abnormal?: boolean }[]
  status: 'pending' | 'approved' | 'released' | 'reviewed'
  testType?: string
  resultDate?: string
  values?: Record<string, unknown>
  normalRange?: string
  releasedDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Document {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  mimeType: string
  patientId: string
  documentType: 'prescription' | 'lab_result' | 'consultation' | 'general' | 'imaging' | 'vaccine'
  description?: string
  uploadedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface Pharmacy {
  id: string
  name: string
  licenseNumber: string
  registrationNumber?: string
  address: {
    street: string
    city: string
    state?: string
    postalCode: string
    country: string
    coordinates?: { latitude: number; longitude: number }
  }
  contacts: { type: 'phone' | 'mobile' | 'fax' | 'email' | 'emergency'; value: string; isPrimary: boolean }[]
  openingHours: { day: string; isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string }[]
  pharmacyManager: { name: string; licenseNumber: string; email?: string; phone?: string }
  services: string[]
  type: 'community' | 'hospital' | 'clinic' | 'online' | 'specialty'
  isActive: boolean
  partnershipStatus: 'active' | 'inactive' | 'suspended' | 'pending'
  notes?: string
  specializations?: string[]
  rating?: { average: number; count: number }
  canDispenseControlledSubstances: boolean
  acceptsInsurance: boolean
  insuranceProviders?: string[]
  createdAt?: string
  updatedAt?: string
}