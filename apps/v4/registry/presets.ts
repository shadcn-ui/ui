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
  accent: "subtle" | "bold"
  menu: "default" | "inverted"
}

export const PRESETS = [
  {
    title: "Vega",
    description: "Vega / Lucide / Inter",
    style: "vega",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "inter",
    accent: "subtle",
    menu: "default",
  },
  {
    title: "One",
    description: "One / Lucide / Inter",
    style: "vega",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "inter",
    accent: "bold",
    menu: "inverted",
  },
  {
    title: "Nova",
    description: "Nova / Hugeicons / Figtree",
    style: "nova",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "figtree",
    accent: "subtle",
    menu: "default",
  },
] satisfies Preset[]
