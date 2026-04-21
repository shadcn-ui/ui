/**
 * Core types for security scanning
 */

export type Severity = "critical" | "warning" | "info"

/**
 * Definition of a security rule
 * Each rule is a self-contained object with a check function
 */
export type SecurityRule = {
  id: string
  severity: Severity
  description: string
  check: (content: string, filePath: string) => SecurityFinding[]
}

/**
 * A single security finding from a rule
 */
export type SecurityFinding = {
  file: string
  line?: number
  rule: string
  severity: Severity
  message: string
  snippet?: string
}

/**
 * Complete security scan report
 */
export type SecurityReport = {
  findings: SecurityFinding[]
  scannedFiles: number
  scannedDependencies: number
  summary: {
    critical: number
    warning: number
    info: number
  }
  passed: boolean
}
