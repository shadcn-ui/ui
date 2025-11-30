import { type IconLibrary } from "shadcn/icons"

import { BaseColor } from "@/registry/base-colors"
import { Font } from "@/registry/fonts"
import { Style } from "@/registry/styles"
import { Theme } from "@/registry/themes"

type Preset = {
  title: string
  style: Style["name"]
  baseColor: BaseColor["name"]
  theme: Theme["name"]
  iconLibrary: IconLibrary["name"]
  font: Font["value"]
}

export const PRESETS = [
  {
    title: "Vega",
    style: "vega",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "inter",
  },
  {
    title: "Nova",
    style: "nova",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "figtree",
  },
] satisfies Preset[]
