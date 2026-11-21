// Custom primary color math shared by the site and the CLI.
// Browser-safe: no Node.js dependencies.

const LIGHT_FOREGROUND = "oklch(0.985 0 0)"
const DARK_FOREGROUND = "oklch(0.205 0 0)"
const OKLCH_PATTERN = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/
const MAX_OFFSET = 8

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

// Matrices from https://bottosson.github.io/posts/oklab/.
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

  // Grays have no meaningful hue; match the registry's "oklch(l 0 0)".
  if (round(chroma) === 0) {
    return `oklch(${round(lightness)} 0 0)`
  }

  return `oklch(${round(lightness)} ${round(chroma)} ${round((hue + 360) % 360)})`
}

// Returns a hex whose hexToOklch output is exactly this value, or null.
// A few OKLCH values come from more than one hex; any of them gives the same css.
export function oklchToHex(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ")
  const match = OKLCH_PATTERN.exec(normalized)
  if (!match) {
    return null
  }

  const [lightness, chroma, hue] = match.slice(1).map(Number)
  const radians = (hue * Math.PI) / 180
  const a = chroma * Math.cos(radians)
  const bAxis = chroma * Math.sin(radians)

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * bAxis) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * bAxis) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * bAxis) ** 3

  const channels = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((linear) => {
    const srgb =
      linear <= 0.0031308
        ? linear * 12.92
        : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055
    return Math.round(srgb * 255)
  })

  // The 3-decimal rounding lands up to 8 steps off near black, so search
  // outward in shells until a hex reproduces the value.
  for (let radius = 0; radius <= MAX_OFFSET; radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dg = -radius; dg <= radius; dg++) {
        for (let db = -radius; db <= radius; db++) {
          if (Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db)) !== radius) {
            continue
          }
          const rgb = [channels[0] + dr, channels[1] + dg, channels[2] + db]
          if (rgb.some((channel) => channel < 0 || channel > 255)) {
            continue
          }
          const hex = rgb
            .map((channel) => channel.toString(16).padStart(2, "0"))
            .join("")
          if (hexToOklch(hex) === normalized) {
            return hex
          }
        }
      }
    }
  }

  return null
}

export function getPrimaryForeground(hex: string) {
  const luminance = relativeLuminance(hex)
  const contrastWithWhite = 1.05 / (luminance + 0.05)
  const contrastWithBlack = (luminance + 0.05) / 0.05

  return contrastWithWhite >= contrastWithBlack
    ? LIGHT_FOREGROUND
    : DARK_FOREGROUND
}
