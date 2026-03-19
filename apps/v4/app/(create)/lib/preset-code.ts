import { encodePreset } from "shadcn/preset"

import { type DesignSystemConfig } from "@/registry/config"

type PresetCodeConfig = Pick<
  DesignSystemConfig,
  | "style"
  | "baseColor"
  | "theme"
  | "chartColor"
  | "iconLibrary"
  | "font"
  | "fontHeading"
  | "radius"
  | "menuAccent"
  | "menuColor"
>

export function getPresetCode(config: PresetCodeConfig) {
  return encodePreset({
    style: config.style,
    baseColor: config.baseColor,
    theme: config.theme,
    chartColor: config.chartColor,
    iconLibrary: config.iconLibrary,
    font: config.font,
    fontHeading: config.fontHeading,
    radius: config.radius,
    menuAccent: config.menuAccent,
    menuColor: config.menuColor,
  })
}
