import { createRegexRule } from "./helpers"

/**
 * Detects hardcoded URL in fetch calls
 */
export const rule = createRegexRule({
  id: "no-hardcoded-fetch",
  severity: "warning",
  description: "Hardcoded URL in fetch",
  pattern: /fetch\s*\(\s*['"]https?:\/\//,
  message:
    "Hardcoded URLs in fetch may indicate data exfiltration or unwanted external calls",
})
