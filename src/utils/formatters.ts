// Date formatting utilities
export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatTime = (time: string | undefined): string => {
  if (!time) return '-'
  return time
}

// Text formatting utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const formatName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '-'
  return `${firstName || ''} ${lastName || ''}`.trim()
}

// Number formatting utilities
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '-'
  return new Intl.NumberFormat('en-US').format(num)
}

// Blood type formatting
export const formatBloodType = (bloodType: string | undefined): string => {
  if (!bloodType || bloodType === 'unknown') return '-'
  return bloodType
}

// Gender formatting
export const formatGender = (gender: string | undefined): string => {
  if (!gender) return '-'
  if (gender === 'prefer_not_to_say') return 'Prefer not to say'
  return capitalize(gender)
}

// Status formatting
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map((word) => capitalize(word))
    .join(' ')
}
