import { createRegexRule } from "./helpers"

/**
 * Detects dynamic import() usage
 */
export const rule = createRegexRule({
  id: "no-dynamic-import",
  severity: "info",
  description: "Dynamic import()",
  pattern: /import\s*\(\s*[^'"]/,
  message: "Dynamic imports can load code at runtime from variable paths",
})
