import { createRegexRule } from "./helpers"

/**
 * Detects prototype pollution patterns
 */
export const rule = createRegexRule({
  id: "no-prototype-pollution",
  severity: "critical",
  description: "Prototype pollution attempt",
  pattern: /(__proto__|constructor\.prototype)/,
  message: "Prototype pollution can lead to prototype chain attacks",
})
