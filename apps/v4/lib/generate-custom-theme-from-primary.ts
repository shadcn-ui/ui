// oklch utilities
export interface OKLCH {
  l: number // 0 to 1
  c: number // 0 to ~0.4
  h: number // 0 to 360
}

function rotateHue(color: OKLCH, degrees: number): OKLCH {
  return {
    ...color,
    h: (color.h + degrees + 360) % 360,
  }
}

function toDarkVariant(color: OKLCH): OKLCH {
  return {
    l: Math.max(color.l - 0.2, 0.6),
    c: Math.max(color.c - 0.05, 0.05),
    h: color.h,
  }
}

function formatOKLCH({ l, c, h }: OKLCH): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`
}

function adjustLightVariant(color: OKLCH, lOffset = -0.08, cBoost = 0.02): OKLCH {
  return {
    l: Math.max(0, Math.min(1, color.l + lOffset)),
    c: Math.min(0.4, color.c + cBoost),
    h: color.h,
  }
}

function adjustDarkVariant(color: OKLCH, lOffset = 0.05, cOffset = -0.02): OKLCH {
  return {
    l: Math.min(1, color.l + lOffset),
    c: Math.max(0.01, color.c + cOffset),
    h: color.h,
  }
}

function getAutoForeground(bg: OKLCH): OKLCH {
  if (bg.l > 0.85) {
    // Too light → use black text
    return { l: 0.15, c: 0.01, h: 0 }; // black
  } else if (bg.l < 0.2) {
    // Too dark → use white text
    return { l: 0.98, c: 0.01, h: 0 }; // white
  } else {
    // Safe middle ground → prefer white text
    return { l: 0.98, c: 0.01, h: 0 }; // white
  }
}

function getDarkForeground(): OKLCH {
  return {
    l: 0.15,
    c: 0.01,
    h: 0,
  }
}

export function generateThemeFromPrimary(primary: OKLCH) {
  const chartOffsets = [0, 20, 40, 60, 80];
  const sidebarOffsets = [-15, 0];

  const theme: Record<string, string> = {
    // Light mode
    "--color-custom-primary": formatOKLCH(primary),
    "--color-custom-primary-foreground": formatOKLCH(getAutoForeground(primary)), // pure black
    "--color-custom-ring": formatOKLCH(adjustLightVariant(rotateHue(primary, 10))),

    "--color-custom-chart-1": formatOKLCH(adjustLightVariant(rotateHue(primary, chartOffsets[0]))),
    "--color-custom-chart-2": formatOKLCH(adjustLightVariant(rotateHue(primary, chartOffsets[1]))),
    "--color-custom-chart-3": formatOKLCH(adjustLightVariant(rotateHue(primary, chartOffsets[2]))),
    "--color-custom-chart-4": formatOKLCH(adjustLightVariant(rotateHue(primary, chartOffsets[3]))),
    "--color-custom-chart-5": formatOKLCH(adjustLightVariant(rotateHue(primary, chartOffsets[4]))),

    "--color-custom-sidebar-primary": formatOKLCH(adjustLightVariant(rotateHue(primary, sidebarOffsets[0]))),
    "--color-custom-sidebar-primary-foreground": formatOKLCH(getAutoForeground(primary)), // pure black
    "--color-custom-sidebar-ring": formatOKLCH(adjustLightVariant(rotateHue(primary, sidebarOffsets[1]))),

    // Dark mode
    "--color-custom-dark-primary": formatOKLCH(adjustDarkVariant(toDarkVariant(primary))),
    "--color-custom-dark-primary-foreground": formatOKLCH(getAutoForeground(rotateHue(primary, 10))), // pure white
    "--color-custom-dark-ring": formatOKLCH(adjustDarkVariant(toDarkVariant(rotateHue(primary, 10)))),
    "--color-custom-dark-sidebar-primary": formatOKLCH(
      adjustDarkVariant(toDarkVariant(rotateHue(primary, sidebarOffsets[0])))
    ),
    "--color-custom-dark-sidebar-primary-foreground": formatOKLCH(getAutoForeground(rotateHue(primary, 100))), // pure white
    "--color-custom-dark-sidebar-ring": formatOKLCH(
      adjustDarkVariant(toDarkVariant(rotateHue(primary, sidebarOffsets[1])))
    ),
  };

  return theme;
}
