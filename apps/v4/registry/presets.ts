export const PRESETS = [
  {
    title: "Preset One",
    style: "nova",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "inter",
  },
  {
    title: "Preset Two",
    style: "lyra",
    baseColor: "stone",
    theme: "yellow",
    iconLibrary: "tabler",
    font: "geist-mono",
  },
  {
    title: "Preset Three",
    style: "maia",
    baseColor: "zinc",
    theme: "green",
    iconLibrary: "lucide",
    font: "noto-sans",
  },
] as const

export type Preset = (typeof PRESETS)[number]
