import type { SecurityFinding, SecurityRule } from "../types"
import { checkModuleImport } from "./helpers"

/**
 * Detects usage of child_process module - critical shell access risk
 */
export const rule: SecurityRule = {
  id: "no-child-process",
  severity: "critical",
  description: "child_process module for shell access",
  check: (content: string, filePath: string): SecurityFinding[] => {
    if (checkModuleImport(content, "child_process")) {
      return [
        {
          file: filePath,
          rule: "no-child-process",
          severity: "critical",
          message:
            "child_process module provides shell access and should not be used in components",
          snippet: "import/require of child_process detected",
        },
      ]
    }
    return []
  },
}
