/**
 * Validates an email address format
 * @param email The email to validate
 * @returns Whether the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'Weak',
  MEDIUM = 'Medium',
  STRONG = 'Strong',
}

/**
 * Evaluates password strength
 * @param password The password to evaluate
 * @returns The password strength level and score
 */
export const evaluatePasswordStrength = (
  password: string
): {
  strength: PasswordStrength
  score: number // 0-100
  feedback: string[]
} => {
  const feedback: string[] = []

  if (!password) {
    return {
      strength: PasswordStrength.WEAK,
      score: 0,
      feedback: ['Password is required'],
    }
  }

  // Start with a base score
  let score = 0

  // Check length
  if (password.length < 6) {
    feedback.push('Password should be at least 6 characters')
  } else if (password.length < 8) {
    score += 10
  } else if (password.length < 10) {
    score += 20
  } else {
    score += 30
  }

  // Check for numbers
  if (/\d/.test(password)) {
    score += 20
  } else {
    feedback.push('Add numbers for a stronger password')
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 20
  } else {
    feedback.push('Add uppercase letters for a stronger password')
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 10
  } else {
    feedback.push('Add lowercase letters for a stronger password')
  }

  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 20
  } else {
    feedback.push('Add special characters for a stronger password')
  }

  // Determine strength based on score
  let strength: PasswordStrength
  if (score < 40) {
    strength = PasswordStrength.WEAK
  } else if (score < 70) {
    strength = PasswordStrength.MEDIUM
  } else {
    strength = PasswordStrength.STRONG
  }

  // If there's no feedback but the password is not strong, add a general suggestion
  if (feedback.length === 0 && strength !== PasswordStrength.STRONG) {
    feedback.push('Try a longer password with a mix of characters')
  }

  return { strength, score, feedback }
}

/**
 * Checks if a password meets minimum requirements
 * @param password The password to check
 * @returns Whether the password meets requirements
 */
export const meetsPasswordRequirements = (password: string): boolean => {
  // Password must be at least 6 characters and include a number
  return password.length >= 6 && /\d/.test(password)
}

/**
 * Gets the color for password strength visualization
 * @param strength The password strength level
 * @returns A color code in hexadecimal
 */
export const getPasswordStrengthColor = (
  strength: PasswordStrength
): string => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return '#E53935' // Red
    case PasswordStrength.MEDIUM:
      return '#FFB300' // Amber
    case PasswordStrength.STRONG:
      return '#43A047' // Green
    default:
      return '#E0E0E0' // Gray
  }
}
