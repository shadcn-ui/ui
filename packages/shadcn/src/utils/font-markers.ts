type FontMarkerSource = {
  fonts?: Array<{
    font?: {
      variable?: string
    }
  }>
  cssVars?: Record<string, Record<string, unknown> | undefined>
}

const FONT_MARKERS_BY_VARIABLE: Record<string, string> = {
  "--font-heading": "cn-font-heading",
}

function normalizeVariable(variable: string) {
  return variable.startsWith("--") ? variable : `--${variable}`
}

export function getSupportedFontMarkers(sources: FontMarkerSource[]) {
  const supportedMarkers = new Set<string>()

  for (const source of sources) {
    for (const font of source.fonts ?? []) {
      const variable = font.font?.variable
      if (!variable) {
        continue
      }

      const marker = FONT_MARKERS_BY_VARIABLE[variable]
      if (marker) {
        supportedMarkers.add(marker)
      }
    }

    for (const vars of Object.values(source.cssVars ?? {})) {
      for (const key of Object.keys(vars ?? {})) {
        const marker = FONT_MARKERS_BY_VARIABLE[normalizeVariable(key)]
        if (marker) {
          supportedMarkers.add(marker)
        }
      }
    }
  }

  return Array.from(supportedMarkers)
}
