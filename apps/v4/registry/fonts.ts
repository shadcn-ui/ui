import { type RegistryItem } from "shadcn/schema"

type FontRegistryDefinition = {
  name: string
  title: string
  family: string
  variable: "--font-sans" | "--font-mono" | "--font-serif"
  provider: "google"
  import: string
  dependency: string
  subsets?: string[]
}

const fontDefinitions = [
  {
    name: "geist",
    title: "Geist",
    family: "'Geist Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Geist",
    dependency: "@fontsource-variable/geist",
  },
  {
    name: "inter",
    title: "Inter",
    family: "'Inter Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Inter",
    dependency: "@fontsource-variable/inter",
  },
  {
    name: "noto-sans",
    title: "Noto Sans",
    family: "'Noto Sans Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    import: "Noto_Sans",
    dependency: "@fontsource-variable/noto-sans",
  },
  {
    name: "nunito-sans",
    title: "Nunito Sans",
    family: "'Nunito Sans Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    import: "Nunito_Sans",
    dependency: "@fontsource-variable/nunito-sans",
  },
  {
    name: "figtree",
    title: "Figtree",
    family: "'Figtree Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Figtree",
    dependency: "@fontsource-variable/figtree",
  },
  {
    name: "roboto",
    title: "Roboto",
    family: "'Roboto Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Roboto",
    dependency: "@fontsource-variable/roboto",
  },
  {
    name: "raleway",
    title: "Raleway",
    family: "'Raleway Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Raleway",
    dependency: "@fontsource-variable/raleway",
  },
  {
    name: "dm-sans",
    title: "DM Sans",
    family: "'DM Sans Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "DM_Sans",
    dependency: "@fontsource-variable/dm-sans",
  },
  {
    name: "public-sans",
    title: "Public Sans",
    family: "'Public Sans Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Public_Sans",
    dependency: "@fontsource-variable/public-sans",
  },
  {
    name: "outfit",
    title: "Outfit",
    family: "'Outfit Variable', sans-serif",
    variable: "--font-sans",
    provider: "google",
    subsets: ["latin"],
    import: "Outfit",
    dependency: "@fontsource-variable/outfit",
  },
  {
    name: "jetbrains-mono",
    title: "JetBrains Mono",
    family: "'JetBrains Mono Variable', monospace",
    variable: "--font-mono",
    provider: "google",
    subsets: ["latin"],
    import: "JetBrains_Mono",
    dependency: "@fontsource-variable/jetbrains-mono",
  },
  {
    name: "geist-mono",
    title: "Geist Mono",
    family: "'Geist Mono Variable', monospace",
    variable: "--font-mono",
    provider: "google",
    subsets: ["latin"],
    import: "Geist_Mono",
    dependency: "@fontsource-variable/geist-mono",
  },
  {
    name: "noto-serif",
    title: "Noto Serif",
    family: "'Noto Serif Variable', serif",
    variable: "--font-serif",
    provider: "google",
    subsets: ["latin"],
    import: "Noto_Serif",
    dependency: "@fontsource-variable/noto-serif",
  },
  {
    name: "roboto-slab",
    title: "Roboto Slab",
    family: "'Roboto Slab Variable', serif",
    variable: "--font-serif",
    provider: "google",
    subsets: ["latin"],
    import: "Roboto_Slab",
    dependency: "@fontsource-variable/roboto-slab",
  },
  {
    name: "merriweather",
    title: "Merriweather",
    family: "'Merriweather Variable', serif",
    variable: "--font-serif",
    provider: "google",
    subsets: ["latin"],
    import: "Merriweather",
    dependency: "@fontsource-variable/merriweather",
  },
  {
    name: "lora",
    title: "Lora",
    family: "'Lora Variable', serif",
    variable: "--font-serif",
    provider: "google",
    subsets: ["latin"],
    import: "Lora",
    dependency: "@fontsource-variable/lora",
  },
  {
    name: "playfair-display",
    title: "Playfair Display",
    family: "'Playfair Display Variable', serif",
    variable: "--font-serif",
    provider: "google",
    subsets: ["latin"],
    import: "Playfair_Display",
    dependency: "@fontsource-variable/playfair-display",
  },
] as const satisfies readonly FontRegistryDefinition[]

function createFontItem(
  definition: FontRegistryDefinition,
  role: "body" | "heading"
) {
  return {
    name:
      role === "body"
        ? `font-${definition.name}`
        : `font-heading-${definition.name}`,
    title: role === "body" ? definition.title : `${definition.title} (Heading)`,
    type: "registry:font",
    font: {
      family: definition.family,
      provider: definition.provider,
      variable: role === "body" ? definition.variable : "--font-heading",
      ...(definition.subsets ? { subsets: definition.subsets } : {}),
      import: definition.import,
      dependency: definition.dependency,
    },
  } satisfies RegistryItem
}

export const bodyFonts = fontDefinitions.map((definition) =>
  createFontItem(definition, "body")
) satisfies RegistryItem[]

export const headingFonts = fontDefinitions.map((definition) =>
  createFontItem(definition, "heading")
) satisfies RegistryItem[]

export const fonts = [...bodyFonts, ...headingFonts] satisfies RegistryItem[]
