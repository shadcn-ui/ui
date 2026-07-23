import { createRegexRule } from "./helpers"

/**
 * Detects document.cookie access
 */
export const rule = createRegexRule({
  id: "no-cookie-access",
  severity: "warning",
  description: "Cookie access",
  pattern: /document\.cookie/,
  message: "Accessing document.cookie may indicate session hijacking attempts",
})
