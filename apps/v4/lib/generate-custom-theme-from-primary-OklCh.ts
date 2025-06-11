// oklch-utils.ts

import { hex2oklch } from "colorizr"

export interface OKLCH {
  l: number // 0 to 1
  c: number // 0 to 0.4+
  h: number // 0 to 360
}

export function hexToOKLCH(hex: string): OKLCH {
   const color = hex2oklch(hex) // Use culori or similar lib
  return {
    l: color.l,
    c: color.c,
    h: color.h * 360,
  }
}

function getForeground(color: OKLCH): OKLCH {
  return {
    l: Math.min(color.l + 1.28, 0.98),
    c: 0.01,
    h: 0,
  }
}

export function rotateHue(color: OKLCH, degrees: number): OKLCH {
  return { ...color, h: (color.h + degrees + 360) % 360 }
}

export function lighten(color: OKLCH, by: number): OKLCH {
  return { ...color, l: Math.min(color.l + by, 1) }
}

export function darken(color: OKLCH, by: number): OKLCH {
  return { ...color, l: Math.max(color.l - by, 0) }
}

export function formatOKLCH({ l, c, h }: OKLCH): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`
}

export function generateThemeFromPrimaryOkhCl(primary: OKLCH) {
  const darkPrimary = lighten(primary, 0.2) // 20% lighter for dark
  const lightPrimary = darken(primary, 0.1) // Slightly darker for light

  const theme = {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      'card-foreground': '240 10% 3.9%',
      popover: '0 0% 100%',
      'popover-foreground': '240 10% 3.9%',
      primary: formatOKLCH(lightPrimary),
      'primary-foreground': formatOKLCH(getForeground(rotateHue(primary, 100))),
      secondary: formatOKLCH(rotateHue(primary, 20)),
      'secondary-foreground': '0 0% 0%',
      muted: formatOKLCH(rotateHue(primary, 60)),
      'muted-foreground': '0 0% 0%',
      accent: formatOKLCH(rotateHue(primary, 120)),
      'accent-foreground': '0 0% 0%',
      destructive: 'oklch(62.8% 0.257 27)',
      'destructive-foreground': '0 0% 98%',
      border: formatOKLCH(rotateHue(primary, 180)),
      input: formatOKLCH(rotateHue(primary, 180)),
      ring: formatOKLCH(rotateHue(primary, 10)),
      'chart-1': formatOKLCH(primary),
      'chart-2': formatOKLCH(rotateHue(primary, 30)),
      'chart-3': formatOKLCH(rotateHue(primary, 60)),
      'chart-4': formatOKLCH(rotateHue(primary, 90)),
      'chart-5': formatOKLCH(rotateHue(primary, 120)),
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      card: '240 10% 3.9%',
      'card-foreground': '0 0% 98%',
      popover: '240 10% 3.9%',
      'popover-foreground': '0 0% 98%',
      primary: formatOKLCH(darkPrimary),
      'primary-foreground': formatOKLCH(getForeground(rotateHue(primary, 100))), 
      secondary: formatOKLCH(lighten(primary, 0.25)),
      'secondary-foreground': '0 0% 100%',
      muted: formatOKLCH(lighten(primary, 0.1)),
      'muted-foreground': '0 0% 100%',
      accent: formatOKLCH(rotateHue(primary, -60)),
      'accent-foreground': '0 0% 100%',
      destructive: 'oklch(42.8% 0.257 27)',
      'destructive-foreground': '0 0% 98%',
      border: formatOKLCH(lighten(primary, 0.2)),
      input: formatOKLCH(lighten(primary, 0.2)),
      ring: formatOKLCH(lighten(rotateHue(primary, 10), 0.1)),
      'chart-1': formatOKLCH(darkPrimary),
      'chart-2': formatOKLCH(rotateHue(darkPrimary, 30)),
      'chart-3': formatOKLCH(rotateHue(darkPrimary, 60)),
      'chart-4': formatOKLCH(rotateHue(darkPrimary, 90)),
      'chart-5': formatOKLCH(rotateHue(darkPrimary, 120)),
    },
  }

  return theme
}
