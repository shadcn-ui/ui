import { createParser } from "nuqs/server"

const HEX_PATTERN = /^[0-9a-f]{6}$/

// Accepts "#abc", "abc", "#aabbcc" or "aabbcc" and returns "aabbcc", or null.
export function normalizeHex(input: string) {
  let hex = input.trim().replace(/^#/, "").toLowerCase()

  if (/^[0-9a-f]{3}$/.test(hex)) {
    hex = hex.replace(/./g, "$&$&")
  }

  return HEX_PATTERN.test(hex) ? hex : null
}

export const parseAsHexColor = createParser({
  parse: normalizeHex,
  serialize: (value: string) => value,
})
