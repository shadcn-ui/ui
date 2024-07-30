"use client"

import { useThemesConfig } from "@/hooks/use-themes-config"

export function ThemesStyle() {
  const { themesConfig } = useThemesConfig()

  if (!themesConfig.activeTheme) {
    return null
  }

  return (
    <style>
      {`
.themes-wrapper,
[data-chart] {
  ${Object.entries(themesConfig.activeTheme.cssVars.light)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n")}
}

.dark .themes-wrapper,
.dark [data-chart] {
  ${Object.entries(themesConfig.activeTheme.cssVars.dark)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n")}
}
  `}
    </style>
  )
}
