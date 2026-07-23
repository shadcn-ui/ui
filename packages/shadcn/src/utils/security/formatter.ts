import { bold, cyan, dim, green, red, yellow } from "kleur/colors"

import type { SecurityFinding, SecurityReport, Severity } from "./types"



/**
 * Formats a security report for CLI output
 * Similar pattern to dry-run-formatter.ts with box-drawing characters
 */
export function formatSecurityReport(
  report: SecurityReport,
  componentNames: string[]
): string {
  const lines: string[] = []

  // Header
  const statusText = report.passed ? green("PASSED") : red("FAILED")
  lines.push(
    `${bold("┌")} ${bold(`Security Scan`)} ${dim(`for ${componentNames.join(", ")}`)}`
  )
  lines.push(dim("│"))

  // Summary section
  lines.push(`${dim("├")} ${bold("Summary")} ${statusText}`)

  if (report.summary.critical > 0) {
    lines.push(`${dim("│")} ${red(`${report.summary.critical} critical`)}`)
  }
  if (report.summary.warning > 0) {
    lines.push(`${dim("│")} ${yellow(`${report.summary.warning} warnings`)}`)
  }
  if (report.summary.info > 0) {
    lines.push(`${dim("│")} ${cyan(`${report.summary.info} info`)}`)
  }

  if (
    report.summary.critical === 0 &&
    report.summary.warning === 0 &&
    report.summary.info === 0
  ) {
    lines.push(`${dim("│")} ${green("✓ No security issues found")}`)
  }

  lines.push(dim("│"))

  // Scan stats
  lines.push(`${dim("├")} ${bold("Scanned")}`)
  lines.push(`${dim("│")} ${dim(`${report.scannedFiles} files`)}`)
  if (report.scannedDependencies > 0) {
    lines.push(
      `${dim("│")} ${dim(`${report.scannedDependencies} dependencies`)}`
    )
  }
  lines.push(dim("│"))

  // Findings grouped by severity
  if (report.findings.length > 0) {
    const criticalFindings = report.findings.filter(
      (f) => f.severity === "critical"
    )
    const warningFindings = report.findings.filter(
      (f) => f.severity === "warning"
    )
    const infoFindings = report.findings.filter((f) => f.severity === "info")

    if (criticalFindings.length > 0) {
      formatFindingsSection("Critical", criticalFindings, lines, red)
    }

    if (warningFindings.length > 0) {
      formatFindingsSection("Warnings", warningFindings, lines, yellow)
    }

    if (infoFindings.length > 0) {
      formatFindingsSection("Info", infoFindings, lines, cyan)
    }
  }

  // Footer
  if (report.passed) {
    lines.push(
      `${dim("└")} ${green("No security issues found. Safe to install.")}`
    )
  } else {
    const totalIssues = report.summary.critical + report.summary.warning
    lines.push(
      `${dim("└")} ${red(
        `${totalIssues} security issue${totalIssues === 1 ? "" : "s"} found. Installation blocked.`
      )}`
    )
  }

  return lines.join("\n")
}

function formatFindingsSection(
  title: string,
  findings: SecurityFinding[],
  lines: string[],
  colorFn: (text: string) => string
) {
  lines.push(`${dim("├")} ${bold(title)} ${dim(`(${findings.length})`)}`)

  for (const finding of findings) {
    const location = finding.line
      ? `${finding.file}:${finding.line}`
      : finding.file

    lines.push(`${dim("│")}  ${dim(location)}`)
    lines.push(`${dim("│")}  ${colorFn(finding.message)}`)

    if (finding.snippet) {
      const snippet =
        finding.snippet.length > 70
          ? finding.snippet.substring(0, 67) + "..."
          : finding.snippet
      lines.push(`${dim("│")}   ${dim(snippet)}`)
    }
  }

  lines.push(dim("│"))
}
