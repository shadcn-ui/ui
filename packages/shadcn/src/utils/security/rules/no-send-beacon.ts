import { createRegexRule } from "./helpers"

/**
 * Detects usage of navigator.sendBeacon() - potential data exfiltration
 */
export const rule = createRegexRule({
  id: "no-send-beacon",
  severity: "critical",
  description: "sendBeacon API for data exfiltration",
  pattern: /navigator\.sendBeacon\s*\(/,
  message: "sendBeacon can be used to exfiltrate data to external servers",
})
