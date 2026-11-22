type ColorPickerFormat = "hex" | "oklch"

// Hue in degrees [0, 360). Saturation, value (brightness) and alpha in [0, 1].
type HsvaColor = {
  h: number
  s: number
  v: number
  a: number
}

// Gamma-encoded sRGB channels in [0, 1].
type RgbColor = {
  r: number
  g: number
  b: number
}

// Lightness in [0, 1], chroma >= 0, hue in degrees [0, 360).
type OklchColor = {
  l: number
  c: number
  h: number
}

type LinearRgb = [number, number, number]

const GAMUT_EPSILON = 1e-6
const GAMUT_SEARCH_STEPS = 24

// CSS Color 4: 100% lightness is 1 and 100% chroma is 0.4 in oklch().
const OKLCH_LIGHTNESS_PERCENT_REFERENCE = 1
const OKLCH_CHROMA_PERCENT_REFERENCE = 0.4

const HEX_PATTERN = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const OKLCH_PATTERN =
  /^oklch\(\s*([^\s/]+)\s+([^\s/]+)\s+([^\s/]+)\s*(?:\/\s*([^\s/]+)\s*)?\)$/i
const NUMERIC_TOKEN_PATTERN =
  /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%|deg|rad|grad|turn)?$/i

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function round(value: number, digits: number) {
  const factor = 10 ** digits

  // Adding 0 turns -0 into 0.
  return Math.round(value * factor) / factor + 0
}

function normalizeHue(hue: number) {
  const normalized = hue % 360

  return (normalized < 0 ? normalized + 360 : normalized) + 0
}

function hsvToRgb({ h, s, v }: Pick<HsvaColor, "h" | "s" | "v">): RgbColor {
  const channel = (offset: number) => {
    const k = (offset + normalizeHue(h) / 60) % 6

    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }

  return { r: channel(5), g: channel(3), b: channel(1) }
}

function rgbToHsv({ r, g, b }: RgbColor): Pick<HsvaColor, "h" | "s" | "v"> {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0

  if (delta > 0) {
    if (max === r) {
      hue = (g - b) / delta
    } else if (max === g) {
      hue = (b - r) / delta + 2
    } else {
      hue = (r - g) / delta + 4
    }
  }

  return {
    h: normalizeHue(hue * 60),
    s: max === 0 ? 0 : delta / max,
    v: max,
  }
}

function toLinear(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

function fromLinear(channel: number) {
  return channel <= 0.0031308
    ? channel * 12.92
    : 1.055 * channel ** (1 / 2.4) - 0.055
}

// Matrices from Björn Ottosson, "A perceptual color space for image
// processing" (https://bottosson.github.io/posts/oklab/).
function linearRgbToOklab([r, g, b]: LinearRgb): LinearRgb {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function oklabToLinearRgb([lightness, a, b]: LinearRgb): LinearRgb {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function oklchToLinearRgb(l: number, c: number, h: number) {
  const radians = (h * Math.PI) / 180

  return oklabToLinearRgb([l, c * Math.cos(radians), c * Math.sin(radians)])
}

function isLinearRgbInGamut(channels: LinearRgb) {
  return channels.every(
    (channel) => channel >= -GAMUT_EPSILON && channel <= 1 + GAMUT_EPSILON
  )
}

function rgbToOklch({ r, g, b }: RgbColor): OklchColor {
  const [l, a, bAxis] = linearRgbToOklab([
    toLinear(r),
    toLinear(g),
    toLinear(b),
  ])

  return {
    l,
    c: Math.hypot(a, bAxis),
    h: normalizeHue((Math.atan2(bAxis, a) * 180) / Math.PI),
  }
}

function isOklchInGamut({ l, c, h }: OklchColor) {
  return isLinearRgbInGamut(oklchToLinearRgb(l, c, h))
}

// Colors outside sRGB keep their lightness and hue and lose chroma until they
// fit, so the result never shifts toward a different hue.
function oklchToRgb({ l, c, h }: OklchColor): RgbColor {
  const lightness = clamp(l, 0, 1)
  let chroma = Math.max(0, c)

  if (!isOklchInGamut({ l: lightness, c: chroma, h })) {
    let low = 0
    let high = chroma

    for (let step = 0; step < GAMUT_SEARCH_STEPS; step++) {
      const middle = (low + high) / 2

      if (isOklchInGamut({ l: lightness, c: middle, h })) {
        low = middle
      } else {
        high = middle
      }
    }

    chroma = low
  }

  const [r, g, b] = oklchToLinearRgb(lightness, chroma, h)

  return {
    r: fromLinear(clamp(r, 0, 1)),
    g: fromLinear(clamp(g, 0, 1)),
    b: fromLinear(clamp(b, 0, 1)),
  }
}

function parseNumericToken(token: string) {
  if (token.toLowerCase() === "none") {
    return { value: 0, unit: "" }
  }

  const match = NUMERIC_TOKEN_PATTERN.exec(token)

  if (!match) {
    return null
  }

  return { value: Number(match[1]), unit: (match[2] ?? "").toLowerCase() }
}

function parseScalarToken(token: string, percentReference: number) {
  const parsed = parseNumericToken(token)

  if (!parsed || (parsed.unit !== "" && parsed.unit !== "%")) {
    return null
  }

  return parsed.unit === "%"
    ? (parsed.value / 100) * percentReference
    : parsed.value
}

function parseHueToken(token: string) {
  const parsed = parseNumericToken(token)

  if (!parsed) {
    return null
  }

  switch (parsed.unit) {
    case "":
    case "deg":
      return normalizeHue(parsed.value)
    case "rad":
      return normalizeHue((parsed.value * 180) / Math.PI)
    case "grad":
      return normalizeHue(parsed.value * 0.9)
    case "turn":
      return normalizeHue(parsed.value * 360)
    default:
      return null
  }
}

function parseHex(value: string): HsvaColor | null {
  const match = HEX_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const digits =
    match[1].length <= 4
      ? Array.from(match[1], (digit) => digit + digit).join("")
      : match[1]
  const channels: number[] = []

  for (let index = 0; index < digits.length; index += 2) {
    channels.push(parseInt(digits.slice(index, index + 2), 16) / 255)
  }

  const [r, g, b, a = 1] = channels

  return { ...rgbToHsv({ r, g, b }), a }
}

function parseOklch(value: string): HsvaColor | null {
  const match = OKLCH_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const l = parseScalarToken(match[1], OKLCH_LIGHTNESS_PERCENT_REFERENCE)
  const c = parseScalarToken(match[2], OKLCH_CHROMA_PERCENT_REFERENCE)
  const h = parseHueToken(match[3])
  const a = match[4] === undefined ? 1 : parseScalarToken(match[4], 1)

  if (l === null || c === null || h === null || a === null) {
    return null
  }

  return { ...rgbToHsv(oklchToRgb({ l, c, h })), a: clamp(a, 0, 1) }
}

function getColorFormat(value: string): ColorPickerFormat | null {
  const trimmed = value.trim()

  if (OKLCH_PATTERN.test(trimmed)) {
    return "oklch"
  }

  return HEX_PATTERN.test(trimmed) ? "hex" : null
}

// Parses a hex (#rgb, #rgba, #rrggbb, #rrggbbaa, "#" optional) or oklch()
// string. Returns null for anything else.
function parseColor(value: string): HsvaColor | null {
  const trimmed = value.trim()

  return /^oklch\(/i.test(trimmed) ? parseOklch(trimmed) : parseHex(trimmed)
}

function toHexByte(channel: number) {
  return Math.round(clamp(channel, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0")
}

function formatHex(color: HsvaColor) {
  const { r, g, b } = hsvToRgb(color)
  const alpha = toHexByte(color.a)

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${alpha === "ff" ? "" : alpha}`
}

// Matches the theme token format: oklch(0.577 0.245 27.325) and
// oklch(1 0 0 / 10%).
function formatOklch(color: HsvaColor) {
  const { l, c, h } = rgbToOklch(hsvToRgb(color))
  const lightness = round(l, 3)
  const chroma = round(c, 3)
  const hue = chroma === 0 ? 0 : round(h, 3) % 360
  const alpha = round(clamp(color.a, 0, 1) * 100, 1)

  return `oklch(${lightness} ${chroma} ${hue}${alpha === 100 ? "" : ` / ${alpha}%`})`
}

function formatColor(color: HsvaColor, format: ColorPickerFormat) {
  return format === "oklch" ? formatOklch(color) : formatHex(color)
}

// A CSS color for gradients and swatches. Alpha defaults to opaque.
function toCssColor(
  color: Pick<HsvaColor, "h" | "s" | "v">,
  alpha: number = 1
) {
  const { r, g, b } = hsvToRgb(color)
  const channels = [r, g, b].map((channel) =>
    round(clamp(channel, 0, 1) * 255, 2)
  )

  return `rgb(${channels.join(" ")} / ${round(clamp(alpha, 0, 1), 4)})`
}

export {
  formatColor,
  toCssColor,
  getColorFormat,
  hsvToRgb,
  isOklchInGamut,
  oklchToRgb,
  parseColor,
  rgbToHsv,
  rgbToOklch,
  type ColorPickerFormat,
  type HsvaColor,
  type OklchColor,
  type RgbColor,
}
