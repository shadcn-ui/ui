import { createRegexRule } from "./helpers"

/**
 * Detects usage of new Function() - critical security risk
 */
export const rule = createRegexRule({
  id: "no-function-constructor",
  severity: "critical",
  description: "Function constructor",
  pattern: /new\s+Function\s*\(/,
  message: "Function constructor can execute arbitrary code like eval()",
})
