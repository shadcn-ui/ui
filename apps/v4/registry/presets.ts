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
  spacing: "default" | "compact"
  radius: "none" | "small" | "medium" | "large"
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
    spacing: "default",
    radius: "medium",
  },
  {
    title: "Vega (Compact)",
    description: "Vega / Lucide / Inter",
    style: "vega",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "geist-sans",
    accent: "bold",
    menu: "inverted",
    spacing: "compact",
    radius: "medium",
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
    spacing: "default",
    radius: "medium",
  },
] satisfies Preset[]
