import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  email_verified: boolean
}

export interface SessionUser extends User {
  permissions: string[]
  roles: Array<{
    id: string
    name: string
    display_name: string
  }>
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return generateToken(48)
}

/**
 * Generate a password reset token
 */
export function generatePasswordResetToken(): string {
  return generateToken(32)
}

/**
 * Generate an email verification token
 */
export function generateEmailVerificationToken(): string {
  return generateToken(32)
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export function isValidPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get password strength score
 */
export function getPasswordStrength(password: string): {
  score: number
  label: string
  suggestions: string[]
} {
  const suggestions: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else suggestions.push('Use at least 8 characters')

  if (password.length >= 12) score += 1
  
  if (/[a-z]/.test(password)) score += 1
  else suggestions.push('Include lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else suggestions.push('Include uppercase letters')
  
  if (/\d/.test(password)) score += 1
  else suggestions.push('Include numbers')
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else suggestions.push('Include special characters')

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  
  return {
    score,
    label: labels[score] || 'Very Weak',
    suggestions
  }
}

/**
 * Sanitize user object for client response (remove sensitive fields)
 */
export function sanitizeUser(user: any): Partial<User> {
  const { password_hash, password, ...sanitized } = user
  return sanitized
}

/**
 * Generate expiration date
 */
export function getExpirationDate(hours: number): Date {
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date
}

/**
 * Format permission string
 */
export function formatPermission(
  module: string,
  resource: string,
  action: string
): string {
  return `${module}:${resource}:${action}`
}

/**
 * Parse permission string
 */
export function parsePermission(permission: string): {
  module: string
  resource: string
  action: string
} | null {
  const parts = permission.split(':')
  if (parts.length !== 3) return null
  
  return {
    module: parts[0],
    resource: parts[1],
    action: parts[2]
  }
}
