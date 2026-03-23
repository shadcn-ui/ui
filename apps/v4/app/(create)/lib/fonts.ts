import {
  DM_Sans,
  Figtree,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Lora,
  Manrope,
  Merriweather,
  Montserrat,
  Noto_Sans,
  Noto_Serif,
  Nunito_Sans,
  Outfit,
  Oxanium,
  Playfair_Display,
  Public_Sans,
  Raleway,
  Roboto,
  Roboto_Slab,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google"

import { FONT_DEFINITIONS, type FontName } from "@/lib/font-definitions"

type PreviewFont = ReturnType<typeof Inter>

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

const PREVIEW_FONTS = {
  geist: geistSans,
  inter,
  "noto-sans": notoSans,
  "nunito-sans": nunitoSans,
  figtree,
  roboto,
  raleway,
  "dm-sans": dmSans,
  "public-sans": publicSans,
  outfit,
  oxanium,
  manrope,
  "space-grotesk": spaceGrotesk,
  montserrat,
  "ibm-plex-sans": ibmPlexSans,
  "source-sans-3": sourceSans3,
  "instrument-sans": instrumentSans,
  "jetbrains-mono": jetbrainsMono,
  "geist-mono": geistMono,
  "noto-serif": notoSerif,
  "roboto-slab": robotoSlab,
  merriweather,
  lora,
  "playfair-display": playfairDisplay,
} satisfies Record<FontName, PreviewFont>

function createFontOption(name: FontName) {
  const definition = FONT_DEFINITIONS.find((font) => font.name === name)

  if (!definition) {
    throw new Error(`Unknown font definition: ${name}`)
  }

  return {
    name: definition.title,
    value: definition.name,
    font: PREVIEW_FONTS[name],
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
