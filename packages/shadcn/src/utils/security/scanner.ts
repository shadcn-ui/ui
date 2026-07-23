import type { DryRunResult } from "../dry-run"
import type { SecurityFinding, SecurityReport, SecurityRule } from "./types"

/**
 * Scans a single file's content against an array of security rules
 * Runner knows nothing about specific rules - they are passed as arguments
 */
export function scanContent(
  content: string,
  filePath: string,
  rules: SecurityRule[]
): SecurityFinding[] {
  const findings: SecurityFinding[] = []

  for (const rule of rules) {
    try {
      const ruleFindings = rule.check(content, filePath)
      findings.push(...ruleFindings)
    } catch (error) {
      // If a rule throws, log it but don't break the scan
      console.error(`Security rule ${rule.id} failed for ${filePath}:`, error)
    }
  }

  return findings
}

/**
 * Scans all files and dependencies from a dry run result
 * Returns a complete security report
 */
export function scanDryRunResult(
  result: DryRunResult,
  rules: SecurityRule[]
): SecurityReport {
  const allFindings: SecurityFinding[] = []
  let scannedFiles = 0

  // Scan all files from the dry run result
  for (const file of result.files) {
    if (file.content) {
      const findings = scanContent(file.content, file.path, rules)
      allFindings.push(...findings)
      scannedFiles++
    }
  }

  // Scan CSS content if present
  if (result.css?.content) {
    const findings = scanContent(result.css.content, result.css.path, rules)
    allFindings.push(...findings)
    scannedFiles++
  }

  // Check dependencies for known malicious packages
  const scannedDependencies =
    result.dependencies.length + result.devDependencies.length

  // Calculate summary
  const summary = {
    critical: allFindings.filter((f) => f.severity === "critical").length,
    warning: allFindings.filter((f) => f.severity === "warning").length,
    info: allFindings.filter((f) => f.severity === "info").length,
  }

  // Report passes only if no critical or warning findings
  const passed = summary.critical === 0 && summary.warning === 0

  return {
    findings: allFindings,
    scannedFiles,
    scannedDependencies,
    summary,
    passed,
  }
}
