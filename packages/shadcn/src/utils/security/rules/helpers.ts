/**
 * Helper function to create regex-based security rules
 */
import type { SecurityFinding, SecurityRule, Severity } from "../types"

/**
 * Creates a security rule that scans content line-by-line with a regex pattern
 * Skips comments (// and /* style)
 */
export function createRegexRule(config: {
  id: string
  severity: Severity
  description: string
  pattern: RegExp
  message?: string
}): SecurityRule {
  return {
    id: config.id,
    severity: config.severity,
    description: config.description,
    check: (content: string, filePath: string): SecurityFinding[] => {
      const findings: SecurityFinding[] = []
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineNumber = i + 1

        // Skip comment lines
        const trimmedLine = line.trim()
        if (
          trimmedLine.startsWith("//") ||
          trimmedLine.startsWith("/*") ||
          trimmedLine.startsWith("*")
        ) {
          continue
        }

        // Check if the line matches the pattern
        if (config.pattern.test(line)) {
          findings.push({
            file: filePath,
            line: lineNumber,
            rule: config.id,
            severity: config.severity,
            message:
              config.message || `Detected ${config.description.toLowerCase()}`,
            snippet: line.trim().substring(0, 100),
          })
        }
      }

      return findings
    },
  }
}

/**
 * Helper to check if content contains a require/import of a specific module
 */
export function checkModuleImport(
  content: string,
  moduleName: string
): boolean {
  // Check for require('module') or require("module")
  const requirePattern = new RegExp(
    `require\\s*\\(\\s*['"]${moduleName}['"]\\s*\\)`,
    "i"
  )

  // Check for import statements
  const importPattern = new RegExp(
    `import\\s+.*?\\s+from\\s+['"]${moduleName}['"]`,
    "i"
  )

  // Check for dynamic import
  const dynamicImportPattern = new RegExp(
    `import\\s*\\(\\s*['"]${moduleName}['"]\\s*\\)`,
    "i"
  )

  return (
    requirePattern.test(content) ||
    importPattern.test(content) ||
    dynamicImportPattern.test(content)
  )
}
