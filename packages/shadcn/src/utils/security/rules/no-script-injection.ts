import { createRegexRule } from "./helpers"

/**
 * Detects script tag injection patterns
 */
export const rule = createRegexRule({
  id: "no-script-injection",
  severity: "critical",
  description: "Script tag injection",
  pattern: /<script[\s>]/i,
  message: "Dynamic script tag creation can lead to XSS attacks",
})
