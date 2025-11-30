import { type IconLibrary } from "shadcn/icons"

import { BaseColor } from "@/registry/base-colors"
import { Font } from "@/registry/fonts"
import { Style } from "@/registry/styles"
import { Theme } from "@/registry/themes"

export type Preset = {
  title: string
  description: string
  style: Style["name"]
  baseColor: BaseColor["name"]
  theme: Theme["name"]
  iconLibrary: IconLibrary["name"]
  font: Font["value"]
}

export const PRESETS = [
  {
    title: "Vega",
    description: "Lucide / Inter",
    style: "vega",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "inter",
  },
  {
    title: "Nova",
    description: "Hugeicons / Figtree",
    style: "nova",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "figtree",
  },
] satisfies Preset[]
