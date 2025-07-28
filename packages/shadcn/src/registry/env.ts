/**
 * Environment variable utilities for registry configuration
 */

/**
 * Expand environment variables in a string
 * @param value - String containing ${VAR} placeholders
 * @returns String with environment variables expanded
 */
export function expandEnvVars(value: string): string {
  return value.replace(/\${(\w+)}/g, (_match, key) => {
    return process.env[key] || ""
  })
}

/**
 * Extract environment variable names from a string
 * @param value - String containing ${VAR} placeholders
 * @returns Array of environment variable names
 */
export function extractEnvVars(value: string): string[] {
  const vars: string[] = []
  const regex = /\${(\w+)}/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(value)) !== null) {
    vars.push(match[1])
  }

  return vars
}
