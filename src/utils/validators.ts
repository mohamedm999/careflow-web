// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8
}

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak'
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
  
  if (strength >= 3) return 'strong'
  if (strength >= 2) return 'medium'
  return 'weak'
}

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

// Date validation
export const isValidDate = (date: string): boolean => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date()
}

export const isPastDate = (date: string): boolean => {
  return new Date(date) < new Date()
}

// Age validation
export const getAge = (dateOfBirth: string): number => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export const isAdult = (dateOfBirth: string): boolean => {
  return getAge(dateOfBirth) >= 18
}

// Required field validation
export const isRequired = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}
