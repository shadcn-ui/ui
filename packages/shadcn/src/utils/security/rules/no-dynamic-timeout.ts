import { createRegexRule } from "./helpers"

/**
 * Detects setTimeout with string argument (eval-like behavior)
 */
export const rule = createRegexRule({
  id: "no-dynamic-timeout",
  severity: "warning",
  description: "Dynamic setTimeout with string",
  pattern: /setTimeout\s*\(\s*['"`]/,
  message:
    "setTimeout with string argument is similar to eval() and should be avoided",
})
