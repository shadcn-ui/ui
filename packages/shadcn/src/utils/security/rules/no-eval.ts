import { createRegexRule } from "./helpers"

/**
 * Detects usage of eval() - critical security risk
 */
export const rule = createRegexRule({
  id: "no-eval",
  severity: "critical",
  description: "eval() function call",
  pattern: /\beval\s*\(/,
  message: "eval() can execute arbitrary code and should never be used",
})
