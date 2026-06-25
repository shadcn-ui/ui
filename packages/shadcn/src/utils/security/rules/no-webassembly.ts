import { createRegexRule } from "./helpers"

/**
 * Detects WebAssembly usage
 */
export const rule = createRegexRule({
  id: "no-webassembly",
  severity: "info",
  description: "WebAssembly usage",
  pattern: /\bWebAssembly\b/,
  message: "WebAssembly allows executing compiled code",
})
