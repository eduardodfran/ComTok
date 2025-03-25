/**
 * Formats a number for display (e.g., 1000 -> 1k)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Format username for display
 */
export function formatUsername(username: string): string {
  // Ensure it starts with @
  return username.startsWith('@') ? username : `@${username}`
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return '?'

  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return name.substring(0, 1).toUpperCase()
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Format a phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Format as (XXX) XXX-XXXX
  const cleaned = phoneNumber.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }

  return phoneNumber
}
