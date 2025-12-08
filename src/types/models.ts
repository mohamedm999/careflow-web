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

// Updated to match backend model
export interface Appointment {
  id: string
  patient: string | User  // ObjectId ref to User
  doctor: string | User   // ObjectId ref to User
  dateTime: string
  duration: number
  reason: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  createdBy?: string | User
  reminderSent?: boolean
  createdAt?: string
  updatedAt?: string
}

// Updated to match backend model
export interface Medication {
  medicationName: string
  dosage: string
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'ointment' | 'drops' | 'inhaler' | 'patch' | 'suppository' | 'other'
  route: 'oral' | 'topical' | 'intravenous' | 'intramuscular' | 'subcutaneous' | 'inhalation' | 'rectal' | 'ophthalmic' | 'otic' | 'nasal' | 'sublingual' | 'transdermal' | 'other'
  frequency: string
  duration: { value: number; unit: 'days' | 'weeks' | 'months' }
  quantity: number
  refills?: number
  instructions?: string
  indication?: string
  warnings?: string
}

export interface Prescription {
  id: string
  patient: string | Patient
  doctor: string | User
  consultation?: string
  prescriptionNumber: string
  prescriptionDate: string
  medications: Medication[]
  pharmacy?: string
  diagnosis?: string
  notes?: string
  status: 'draft' | 'signed' | 'sent' | 'dispensed' | 'partially_dispensed' | 'cancelled' | 'expired'
  signedBy?: string | User
  signedAt?: string
  priority: 'routine' | 'urgent' | 'stat'
  expiryDate?: string
  createdAt?: string
  updatedAt?: string
}

// Updated to match backend model
export interface VitalSigns {
  bloodPressure?: { systolic?: number; diastolic?: number }
  heartRate?: number
  temperature?: number
  weight?: number
  height?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  bmi?: number
}

export interface Diagnosis {
  code?: string
  description: string
  type: 'primary' | 'secondary' | 'provisional' | 'differential'
  notes?: string
}

export interface Procedure {
  code?: string
  name: string
  description?: string
  duration?: number
  outcome?: string
  notes?: string
}

export interface Consultation {
  id: string
  appointment?: string
  patient: string | Patient
  doctor: string | User
  consultationDate: string
  consultationType: 'initial' | 'follow_up' | 'emergency' | 'routine_checkup' | 'specialist'
  chiefComplaint: string
  historyOfPresentIllness?: string
  vitalSigns?: VitalSigns
  physicalExamination?: {
    general?: string
    cardiovascular?: string
    respiratory?: string
    abdominal?: string
    neurological?: string
    musculoskeletal?: string
    skin?: string
    other?: string
  }
  diagnoses?: Diagnosis[]
  procedures?: Procedure[]
  treatmentPlan?: string
  recommendations?: string
  followUpRequired?: boolean
  followUpDate?: string
  followUpInstructions?: string
  privateNotes?: string
  status: 'draft' | 'completed' | 'reviewed' | 'archived'
  completedAt?: string
  reviewedBy?: string | User
  reviewedAt?: string
  createdAt?: string
  updatedAt?: string
}

// Updated to match backend model
export interface LabTest {
  testCode: string
  testName: string
  category: 'hematology' | 'biochemistry' | 'microbiology' | 'immunology' | 'pathology' | 'radiology' | 'molecular' | 'toxicology' | 'genetics' | 'other'
  specimenType: 'blood' | 'urine' | 'stool' | 'saliva' | 'tissue' | 'swab' | 'cerebrospinal_fluid' | 'sputum' | 'other'
  fastingRequired?: boolean
  instructions?: string
}

export interface LabOrder {
  id: string
  orderNumber?: string
  patient: string | Patient
  doctor: string | User
  consultation?: string
  orderDate?: string
  tests: LabTest[]
  clinicalDiagnosis?: string
  clinicalNotes?: string
  priority: 'routine' | 'urgent' | 'stat'
  status: 'ordered' | 'specimen_collected' | 'received' | 'in_progress' | 'completed' | 'validated' | 'reported' | 'cancelled' | 'rejected'
  specimenCollection?: {
    collectedBy?: string | User
    collectionDate?: string
    collectionSite?: string
    collectionMethod?: string
  }
  createdAt?: string
  updatedAt?: string
}

// Updated to match backend model
export interface TestResult {
  testId: string
  testCode: string
  testName: string
  category: string
  resultValue: string
  resultUnit?: string
  referenceRange?: { min?: number; max?: number; text?: string }
  flag: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high' | 'abnormal' | 'positive' | 'negative'
  interpretation?: string
  notes?: string
  method?: string
  status: 'preliminary' | 'final' | 'corrected' | 'cancelled'
  resultDateTime?: string
  performedBy?: string | User
}

export interface LabResult {
  id: string
  labOrder: string | LabOrder
  patient: string | Patient
  doctor: string | User
  testResults: TestResult[]
  reportDocument?: {
    s3Key?: string
    fileName?: string
    fileSize?: number
    mimeType?: string
    uploadedAt?: string
  }
  reportSummary?: string
  overallInterpretation?: string
  recommendations?: string
  hasCriticalResults?: boolean
  criticalResultsDescription?: string
  status: 'preliminary' | 'final' | 'corrected' | 'cancelled' | 'amended'
  validatedBy?: string | User
  validatedAt?: string
  validationNotes?: string
  resultDate: string
  createdAt?: string
  updatedAt?: string
}

// Updated to match backend model
export interface Document {
  id: string
  title: string
  description?: string
  category: 'imaging' | 'lab_report' | 'prescription' | 'consultation_note' | 'discharge_summary' | 'operative_report' | 'pathology_report' | 'consent_form' | 'insurance' | 'referral' | 'vaccination_record' | 'medical_certificate' | 'other'
  subCategory?: string
  patient: string | Patient
  consultation?: string
  labOrder?: string
  prescription?: string
  storage: {
    s3Key: string
    bucket: string
    region?: string
    url?: string
  }
  file: {
    originalName: string
    mimeType: string
    size: number
    checksum?: string
  }
  uploadedBy: string | User
  tags?: string[]
  isConfidential?: boolean
  expiresAt?: string
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