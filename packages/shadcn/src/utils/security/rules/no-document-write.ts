import { createRegexRule } from "./helpers"

/**
 * Detects usage of document.write() - can lead to XSS
 */
export const rule = createRegexRule({
  id: "no-document-write",
  severity: "critical",
  description: "document.write() call",
  pattern: /document\.write\s*\(/,
  message: "document.write() can lead to XSS vulnerabilities",
})
