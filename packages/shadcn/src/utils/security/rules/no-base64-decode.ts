import { createRegexRule } from "./helpers"

/**
 * Detects usage of atob() - possible base64 obfuscation
 */
export const rule = createRegexRule({
  id: "no-base64-decode",
  severity: "warning",
  description: "Base64 decoding (atob)",
  pattern: /\batob\s*\(/,
  message: "Base64 decoding may indicate code obfuscation",
})
