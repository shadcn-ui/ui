import { z } from "zod"

import { colors } from "@/registry/registry-colors"

const colorSchema = z.object({
  name: z.string(),
  id: z.string(),
  scale: z.number(),
  className: z.string(),
  hex: z.string(),
  rgb: z.string(),
  hsl: z.string(),
  foreground: z.string(),
  oklch: z.string(),
  var: z.string(),
})

const colorPaletteSchema = z.object({
  name: z.string(),
  colors: z.array(colorSchema),
})

export type ColorPalette = z.infer<typeof colorPaletteSchema>

export function getColorFormat(color: Color) {
  return {
    className: `bg-${color.name}-100`,
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    oklch: color.oklch,
    var: `--color-${color.name}-${color.scale}`,
  }
}

export type ColorFormat = keyof ReturnType<typeof getColorFormat>

export function getColors() {
  const tailwindColors = colorPaletteSchema.array().parse(
    Object.entries(colors)
      .map(([name, color]) => {
        if (!Array.isArray(color)) {
          return null
        }

        return {
          name,
          colors: color.map((color) => {
            const rgb = color.rgb.replace(
              /^rgb\((\d+),(\d+),(\d+)\)$/,
              "$1 $2 $3"
            )

            return {
              ...color,
              name,
              id: `${name}-${color.scale}`,
              className: `${name}-${color.scale}`,
              var: `--color-${name}-${color.scale}`,
              rgb,
              hsl: color.hsl.replace(
                /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
                "$1 $2 $3"
              ),
              oklch: `oklch(${color.oklch.replace(
                /^oklch\(([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\)$/,
                "$1 $2 $3"
              )})`,
              foreground: getForegroundFromBackground(rgb),
            }
          }),
        }
      })
      .filter(Boolean)
  )

  return tailwindColors
}

export type Color = ReturnType<typeof getColors>[number]["colors"][number]

function getForegroundFromBackground(rgb: string) {
  const [r, g, b] = rgb.split(" ").map(Number)

  function toLinear(number: number): number {
    const base = number / 255
    return base <= 0.04045
      ? base / 12.92
      : Math.pow((base + 0.055) / 1.055, 2.4)
  }

  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  return luminance > 0.179 ? "#000" : "#fff"
}
