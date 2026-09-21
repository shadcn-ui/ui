import { createRegexRule } from "./helpers"

/**
 * Detects innerHTML assignment - potential XSS
 */
export const rule = createRegexRule({
  id: "no-inner-html",
  severity: "warning",
  description: "innerHTML assignment",
  pattern: /\.innerHTML\s*=/,
  message: "innerHTML assignment can lead to XSS if content is not sanitized",
})
