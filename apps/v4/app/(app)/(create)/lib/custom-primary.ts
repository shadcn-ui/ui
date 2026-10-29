import { createParser } from "nuqs/server"

const HEX_PATTERN = /^[0-9a-f]{6}$/

const LIGHT_FOREGROUND = "oklch(0.985 0 0)"
const DARK_FOREGROUND = "oklch(0.205 0 0)"

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

function toLinearRgb(hex: string) {
  return [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
}

function relativeLuminance(hex: string) {
  const [r, g, b] = toLinearRgb(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// matrices from https://bottosson.github.io/posts/oklab/
export function hexToOklch(hex: string) {
  const [r, g, b] = toLinearRgb(hex)

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const chroma = Math.hypot(a, bAxis)
  const hue = (Math.atan2(bAxis, a) * 180) / Math.PI

  const round = (value: number) => Number(value.toFixed(3))

  // grays have no meaningful hue; match the registry's "oklch(l 0 0)".
  if (round(chroma) === 0) {
    return `oklch(${round(lightness)} 0 0)`
  }

  return `oklch(${round(lightness)} ${round(chroma)} ${round((hue + 360) % 360)})`
}

export function getPrimaryForeground(hex: string) {
  const luminance = relativeLuminance(hex)
  const contrastWithWhite = 1.05 / (luminance + 0.05)
  const contrastWithBlack = (luminance + 0.05) / 0.05

  return contrastWithWhite >= contrastWithBlack
    ? LIGHT_FOREGROUND
    : DARK_FOREGROUND
}
