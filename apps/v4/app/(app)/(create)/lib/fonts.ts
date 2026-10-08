import { FONT_DEFINITIONS, type FontName } from "@/lib/font-definitions"

type CreateFont = {
  family: string
  import: string
  previewVariable: string
  style: {
    fontFamily: string
  }
  variable: string
}

function createFontOption(name: FontName) {
  const definition = FONT_DEFINITIONS.find((font) => font.name === name)

  if (!definition) {
    throw new Error(`Unknown font definition: ${name}`)
  }

  return {
    name: definition.title,
    value: definition.name,
    font: {
      family: definition.family,
      import: definition.import,
      previewVariable: definition.previewVariable,
      style: {
        fontFamily: `var(${definition.previewVariable}), ${definition.family}`,
      },
      variable: definition.registryVariable,
    } satisfies CreateFont,
    type: definition.type,
  } as const
}

export const FONTS = [
  createFontOption("geist"),
  createFontOption("inter"),
  createFontOption("noto-sans"),
  createFontOption("nunito-sans"),
  createFontOption("figtree"),
  createFontOption("roboto"),
  createFontOption("raleway"),
  createFontOption("dm-sans"),
  createFontOption("public-sans"),
  createFontOption("outfit"),
  createFontOption("oxanium"),
  createFontOption("manrope"),
  createFontOption("space-grotesk"),
  createFontOption("montserrat"),
  createFontOption("ibm-plex-sans"),
  createFontOption("source-sans-3"),
  createFontOption("instrument-sans"),
  createFontOption("geist-mono"),
  createFontOption("jetbrains-mono"),
  createFontOption("noto-serif"),
  createFontOption("roboto-slab"),
  createFontOption("merriweather"),
  createFontOption("lora"),
  createFontOption("playfair-display"),
  createFontOption("eb-garamond"),
  createFontOption("instrument-serif"),
] as const

export type Font = (typeof FONTS)[number]

export const FONT_HEADING_OPTIONS = [
  {
    name: "Inherit",
    value: "inherit",
    font: null,
    type: "default",
  },
  ...FONTS,
] as const

export type FontHeadingOption = (typeof FONT_HEADING_OPTIONS)[number]
