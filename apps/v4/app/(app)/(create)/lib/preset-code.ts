import { encodePreset, type PresetConfig } from "shadcn/preset"

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
  const presetConfig: Partial<PresetConfig> = {
    style: config.style as PresetConfig["style"],
    baseColor: config.baseColor as PresetConfig["baseColor"],
    theme: config.theme as PresetConfig["theme"],
    chartColor: config.chartColor as PresetConfig["chartColor"],
    iconLibrary: config.iconLibrary as PresetConfig["iconLibrary"],
    font: config.font as PresetConfig["font"],
    fontHeading: config.fontHeading as PresetConfig["fontHeading"],
    radius: config.radius as PresetConfig["radius"],
    menuAccent: config.menuAccent as PresetConfig["menuAccent"],
    menuColor: config.menuColor as PresetConfig["menuColor"],
  }

  return encodePreset(presetConfig)
}
