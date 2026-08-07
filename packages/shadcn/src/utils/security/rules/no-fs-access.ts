import type { SecurityFinding, SecurityRule } from "../types"
import { checkModuleImport } from "./helpers"

/**
 * Detects usage of fs module - filesystem access
 */
export const rule: SecurityRule = {
  id: "no-fs-access",
  severity: "warning",
  description: "Filesystem access via fs module",
  check: (content: string, filePath: string): SecurityFinding[] => {
    if (checkModuleImport(content, "fs")) {
      return [
        {
          file: filePath,
          rule: "no-fs-access",
          severity: "warning",
          message:
            "fs module provides filesystem access and should not be used in components",
          snippet: "import/require of fs detected",
        },
      ]
    }
    return []
  },
}
