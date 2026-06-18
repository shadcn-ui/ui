// Auto-generated — do not edit manually.
// Run: pnpm parse-tokens
// Source: https://github.com/Perforce-Shared-Services/pd-the-force-design-spec

export const primitives = {
  "color": {
    "base": {
      "white": "#ffffff",
      "black": "#000000",
      "transparent": "#00000000"
    },
    "neutral": {
      "0": "#ffffff",
      "50": "#f8f8fd",
      "100": "#f3f3f8",
      "200": "#e9e9ee",
      "300": "#d5d5dc",
      "400": "#9c9ca8",
      "500": "#717180",
      "600": "#525260",
      "700": "#373742",
      "800": "#26262e",
      "850": "#212129",
      "875": "#1c1c24",
      "900": "#111115"
    },
    "indigo": {
      "50": "#f0e8ff",
      "100": "#e0d0ff",
      "200": "#c0a0ff",
      "300": "#9c6cff",
      "400": "#8952ff",
      "500": "#5405ff",
      "600": "#4400d8",
      "700": "#3b00bf",
      "800": "#22006d",
      "900": "#1b0052"
    },
    "cyan": {
      "50": "#eafbff",
      "100": "#dbf8ff",
      "200": "#bcf3ff",
      "300": "#99eeff",
      "400": "#3cdeff",
      "500": "#00cfff",
      "600": "#00aad1",
      "700": "#009bb0",
      "800": "#007a90",
      "900": "#005163"
    },
    "green": {
      "50": "#f3fcf3",
      "100": "#cfefce",
      "200": "#a5dfa5",
      "300": "#5ec25e",
      "500": "#138613",
      "600": "#117911",
      "700": "#0f660f",
      "800": "#0c4c0c",
      "900": "#072c07"
    },
    "orange": {
      "50": "#fffbf7",
      "100": "#fee9dc",
      "200": "#ffd4ba",
      "300": "#fca771",
      "500": "#ff680e",
      "600": "#e25d0c",
      "700": "#c14f0a",
      "800": "#943c08",
      "900": "#512105"
    },
    "cranberry": {
      "50": "#fdf5f6",
      "100": "#f8d6da",
      "200": "#f2b3b8",
      "300": "#eb6b72",
      "500": "#d11323",
      "600": "#be111f",
      "700": "#a30e1c",
      "800": "#7a0a15",
      "900": "#46070c"
    },
    "blue": {
      "50": "#f5fbfe",
      "100": "#d4eafb",
      "200": "#add8f7",
      "300": "#63b6f5",
      "500": "#0084e8",
      "600": "#0077d2",
      "700": "#0066b5",
      "800": "#00508a",
      "900": "#002a4a"
    },
    "alpha": {
      "black-50": "#00000080",
      "black-10": "#0000001a",
      "black-5": "#0000000d",
      "white-50": "#ffffff80",
      "white-20": "#ffffff33",
      "white-10": "#ffffff1a"
    }
  },
  "font": {
    "family": {
      "sans": [
        "Noto Sans",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif"
      ],
      "mono": [
        "Noto Sans Mono",
        "SF Mono",
        "Monaco",
        "Cascadia Code",
        "Consolas",
        "monospace"
      ]
    },
    "weight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "size": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "lineHeight": {
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.75"
    },
    "letterSpacing": {
      "tight": "-0.01em",
      "normal": "0em",
      "wide": "0.025em",
      "wider": "0.05em"
    }
  },
  "spacing": {
    "0": "0px",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem"
  },
  "radius": {
    "none": "0px",
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "duration": {
    "fast": "150ms",
    "normal": "250ms",
    "slow": "350ms",
    "entrance": "500ms"
  },
  "easing": {
    "standard": [
      0.4,
      0,
      0.2,
      1
    ],
    "decelerate": [
      0,
      0,
      0.2,
      1
    ],
    "accelerate": [
      0.4,
      0,
      1,
      1
    ]
  }
} as const

export const light = {
  "color.bg.surface": "#ffffff",
  "color.bg.muted": "#f8f8fd",
  "color.bg.emphasis": "#f3f3f8",
  "color.bg.inverse": "#111115",
  "color.bg.overlay": "#00000080",
  "color.bg.interactive-hover": "#f8f8fd",
  "color.bg.interactive-active": "#f0e8ff",
  "color.bg.primary": "#5405ff",
  "color.bg.primary-hover": "#4400d8",
  "color.bg.primary-active": "#3b00bf",
  "color.bg.primary-subtle": "#f0e8ff",
  "color.bg.primary-subtle-hover": "#e0d0ff",
  "color.bg.on-brand": "#ffffff1a",
  "color.bg.on-brand-hover": "#ffffff33",
  "color.bg.secondary": "#00cfff",
  "color.bg.destructive": "#d11323",
  "color.bg.destructive-hover": "#be111f",
  "color.bg.destructive-active": "#a30e1c",
  "color.bg.success": "#138613",
  "color.bg.success-hover": "#117911",
  "color.bg.success-subtle": "#f3fcf3",
  "color.bg.warning": "#ff680e",
  "color.bg.warning-hover": "#e25d0c",
  "color.bg.warning-subtle": "#fffbf7",
  "color.bg.error-subtle": "#fdf5f6",
  "color.bg.info": "#0084e8",
  "color.bg.info-hover": "#0077d2",
  "color.bg.info-subtle": "#f5fbfe",
  "color.text.primary": "#000000",
  "color.text.secondary": "#26262e",
  "color.text.tertiary": "#525260",
  "color.text.disabled": "#9c9ca8",
  "color.text.on-primary": "#ffffff",
  "color.text.on-secondary": "#000000",
  "color.text.on-success": "#ffffff",
  "color.text.on-warning": "#000000",
  "color.text.on-info": "#ffffff",
  "color.text.on-error": "#ffffff",
  "color.text.on-inverse": "#ffffff",
  "color.text.link": "#5405ff",
  "color.text.link-hover": "#4400d8",
  "color.text.interactive-active": "#3b00bf",
  "color.text.primary-brand": "#5405ff",
  "color.text.success": "#0f660f",
  "color.text.warning": "#c14f0a",
  "color.text.error": "#a30e1c",
  "color.text.info": "#0066b5",
  "color.border.default": "#e9e9ee",
  "color.border.muted": "#f3f3f8",
  "color.border.strong": "#d5d5dc",
  "color.border.focus": "#5405ff",
  "color.border.error": "#d11323",
  "color.border.success": "#138613",
  "color.border.warning": "#ff680e",
  "color.border.info": "#0084e8",
  "color.border.primary": "#5405ff",
  "color.border.destructive": "#d11323",
  "color.border.input": "#717180",
  "color.icon.default": "#525260",
  "color.icon.interactive": "#5405ff",
  "color.icon.success": "#138613",
  "color.icon.warning": "#ff680e",
  "color.icon.error": "#d11323",
  "color.icon.info": "#0084e8",
  "color.icon.warning-accessible": "#c14f0a",
  "color.icon.info-accessible": "#0066b5",
  "color.icon.success-accessible": "#0f660f",
  "color.icon.error-accessible": "#a30e1c",
  "color.chart.1": "#5405ff",
  "color.chart.2": "#00cfff",
  "color.chart.3": "#138613",
  "color.chart.4": "#ff680e",
  "color.chart.5": "#d11323",
  "color.chart.6": "#0084e8",
  "shadow.xs": [
    {
      "offsetX": "0px",
      "offsetY": "1px",
      "blur": "2px",
      "spread": "0px",
      "color": "#00000014"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "2px",
      "spread": "0px",
      "color": "#0000001a"
    }
  ],
  "shadow.sm": [
    {
      "offsetX": "0px",
      "offsetY": "2px",
      "blur": "4px",
      "spread": "0px",
      "color": "#0000001a"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "2px",
      "spread": "0px",
      "color": "#00000014"
    }
  ],
  "shadow.md": [
    {
      "offsetX": "0px",
      "offsetY": "4px",
      "blur": "8px",
      "spread": "0px",
      "color": "#0000001a"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "4px",
      "spread": "0px",
      "color": "#00000014"
    }
  ],
  "shadow.lg": [
    {
      "offsetX": "0px",
      "offsetY": "8px",
      "blur": "16px",
      "spread": "0px",
      "color": "#0000001a"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "8px",
      "spread": "0px",
      "color": "#00000014"
    }
  ],
  "shadow.xl": [
    {
      "offsetX": "0px",
      "offsetY": "16px",
      "blur": "32px",
      "spread": "0px",
      "color": "#0000001f"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "16px",
      "spread": "0px",
      "color": "#00000014"
    }
  ],
  "shadow.focus-ring": [
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "2px",
      "color": "#ffffff"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "4px",
      "color": "#5405ff"
    }
  ],
  "shadow.focus-ring-error": [
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "2px",
      "color": "#ffffff"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "4px",
      "color": "#d11323"
    }
  ],
  "shadow.focus-ring-on-brand": [
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "2px",
      "color": "#5405ff"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "4px",
      "color": "#ffffff"
    }
  ],
  "font.family.default": [
    "Noto Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif"
  ],
  "font.family.code": [
    "Noto Sans Mono",
    "SF Mono",
    "Monaco",
    "Cascadia Code",
    "Consolas",
    "monospace"
  ],
  "font.size.xs": "0.75rem",
  "font.size.sm": "0.875rem",
  "font.size.base": "1rem",
  "font.size.lg": "1.125rem",
  "font.size.xl": "1.25rem",
  "font.size.2xl": "1.5rem",
  "font.size.3xl": "1.875rem",
  "font.size.4xl": "2.25rem",
  "font.weight.regular": 400,
  "font.weight.normal": 400,
  "font.weight.medium": 500,
  "font.weight.semibold": 600,
  "font.weight.bold": 700,
  "font.lineHeight.tight": "1.25",
  "font.lineHeight.snug": "1.375",
  "font.lineHeight.normal": "1.5",
  "font.lineHeight.relaxed": "1.75",
  "font.letterSpacing.tight": "-0.01em",
  "font.letterSpacing.normal": "0em",
  "font.letterSpacing.wide": "0.025em",
  "font.letterSpacing.wider": "0.05em",
  "spacing.0": "0px",
  "spacing.1": "0.25rem",
  "spacing.2": "0.5rem",
  "spacing.3": "0.75rem",
  "spacing.4": "1rem",
  "spacing.5": "1.25rem",
  "spacing.6": "1.5rem",
  "spacing.8": "2rem",
  "spacing.10": "2.5rem",
  "spacing.12": "3rem",
  "spacing.16": "4rem",
  "spacing.20": "5rem",
  "radius.none": "0px",
  "radius.sm": "0.25rem",
  "radius.md": "0.375rem",
  "radius.lg": "0.5rem",
  "radius.xl": "0.75rem",
  "radius.full": "9999px",
  "radius.button": "0.375rem",
  "radius.input": "0.375rem",
  "radius.card": "0.5rem",
  "radius.modal": "0.75rem",
  "radius.badge": "9999px",
  "duration.fast": "150ms",
  "duration.normal": "250ms",
  "duration.slow": "350ms",
  "duration.entrance": "500ms",
  "easing.standard": [
    0.4,
    0,
    0.2,
    1
  ],
  "easing.decelerate": [
    0,
    0,
    0.2,
    1
  ],
  "easing.accelerate": [
    0.4,
    0,
    1,
    1
  ],
  "zIndex.dropdown": 100,
  "zIndex.sticky": 200,
  "zIndex.fixed": 300,
  "zIndex.modal-backdrop": 400,
  "zIndex.modal": 500,
  "zIndex.popover": 600,
  "zIndex.tooltip": 700,
  "zIndex.toast": 800,
  "opacity.disabled": 0.5,
  "opacity.subtle": 0.7,
  "opacity.overlay": 0.5,
  "blur.sm": "8px",
  "blur.md": "16px",
  "blur.lg": "24px",
  "blur.xl": "40px",
  "breakpoint.sm": "576px",
  "breakpoint.md": "768px",
  "breakpoint.lg": "992px",
  "breakpoint.xl": "1200px",
  "breakpoint.2xl": "1400px",
  "layout.header-height": "4rem",
  "layout.sidebar-width": "16rem",
  "layout.sidebar-collapsed": "4rem",
  "layout.content-max-width": "87.5rem",
  "layout.content-padding": "1.5rem"
} as const

export const dark = {
  "color.bg.surface": "#26262e",
  "color.bg.muted": "#212129",
  "color.bg.emphasis": "#1c1c24",
  "color.bg.inverse": "#ffffff",
  "color.bg.overlay": "#00000080",
  "color.bg.interactive-hover": "#26262e",
  "color.bg.interactive-active": "#002a36",
  "color.bg.primary": "#00cfff",
  "color.bg.primary-hover": "#3cdeff",
  "color.bg.primary-active": "#00aad1",
  "color.bg.primary-subtle": "#002a36",
  "color.bg.primary-subtle-hover": "#007a90",
  "color.bg.on-brand": "#ffffff1a",
  "color.bg.on-brand-hover": "#ffffff33",
  "color.bg.secondary": "#9c6cff",
  "color.bg.destructive": "#eb6b72",
  "color.bg.destructive-hover": "#f2b3b8",
  "color.bg.destructive-active": "#d11323",
  "color.bg.success": "#5ec25e",
  "color.bg.success-hover": "#a5dfa5",
  "color.bg.success-subtle": "#072c07",
  "color.bg.warning": "#fca771",
  "color.bg.warning-hover": "#ffd4ba",
  "color.bg.warning-subtle": "#512105",
  "color.bg.error-subtle": "#46070c",
  "color.bg.info": "#63b6f5",
  "color.bg.info-hover": "#add8f7",
  "color.bg.info-subtle": "#002a4a",
  "color.text.primary": "#f8f8fd",
  "color.text.secondary": "#d5d5dc",
  "color.text.tertiary": "#9c9ca8",
  "color.text.disabled": "#717180",
  "color.text.on-primary": "#000000",
  "color.text.on-secondary": "#000000",
  "color.text.on-success": "#000000",
  "color.text.on-warning": "#000000",
  "color.text.on-info": "#000000",
  "color.text.on-error": "#000000",
  "color.text.on-inverse": "#000000",
  "color.text.link": "#99eeff",
  "color.text.link-hover": "#bcf3ff",
  "color.text.interactive-active": "#99eeff",
  "color.text.primary-brand": "#99eeff",
  "color.text.success": "#5ec25e",
  "color.text.warning": "#fca771",
  "color.text.error": "#eb6b72",
  "color.text.info": "#63b6f5",
  "color.border.default": "#373742",
  "color.border.muted": "#26262e",
  "color.border.strong": "#525260",
  "color.border.focus": "#3cdeff",
  "color.border.error": "#eb6b72",
  "color.border.success": "#5ec25e",
  "color.border.warning": "#fca771",
  "color.border.info": "#63b6f5",
  "color.border.primary": "#3cdeff",
  "color.border.destructive": "#eb6b72",
  "color.border.input": "#717180",
  "color.icon.default": "#9c9ca8",
  "color.icon.interactive": "#3cdeff",
  "color.icon.success": "#5ec25e",
  "color.icon.warning": "#fca771",
  "color.icon.error": "#eb6b72",
  "color.icon.info": "#63b6f5",
  "color.icon.warning-accessible": "#fca771",
  "color.icon.info-accessible": "#63b6f5",
  "color.icon.success-accessible": "#5ec25e",
  "color.icon.error-accessible": "#eb6b72",
  "color.chart.1": "#3cdeff",
  "color.chart.2": "#9c6cff",
  "color.chart.3": "#5ec25e",
  "color.chart.4": "#fca771",
  "color.chart.5": "#eb6b72",
  "color.chart.6": "#63b6f5",
  "shadow.xs": [
    {
      "offsetX": "0px",
      "offsetY": "1px",
      "blur": "2px",
      "spread": "0px",
      "color": "#00000033"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "2px",
      "spread": "0px",
      "color": "#00000040"
    }
  ],
  "shadow.sm": [
    {
      "offsetX": "0px",
      "offsetY": "2px",
      "blur": "4px",
      "spread": "0px",
      "color": "#00000040"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "2px",
      "spread": "0px",
      "color": "#00000033"
    }
  ],
  "shadow.md": [
    {
      "offsetX": "0px",
      "offsetY": "4px",
      "blur": "8px",
      "spread": "0px",
      "color": "#00000040"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "4px",
      "spread": "0px",
      "color": "#00000033"
    }
  ],
  "shadow.lg": [
    {
      "offsetX": "0px",
      "offsetY": "8px",
      "blur": "16px",
      "spread": "0px",
      "color": "#00000040"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "8px",
      "spread": "0px",
      "color": "#00000033"
    }
  ],
  "shadow.xl": [
    {
      "offsetX": "0px",
      "offsetY": "16px",
      "blur": "32px",
      "spread": "0px",
      "color": "#0000004d"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "16px",
      "spread": "0px",
      "color": "#00000040"
    }
  ],
  "shadow.focus-ring": [
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "2px",
      "color": "#ffffff"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "4px",
      "color": "#3cdeff"
    }
  ],
  "shadow.focus-ring-error": [
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "2px",
      "color": "#ffffff"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "4px",
      "color": "#eb6b72"
    }
  ],
  "shadow.focus-ring-on-brand": [
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "2px",
      "color": "#5405ff"
    },
    {
      "offsetX": "0px",
      "offsetY": "0px",
      "blur": "0px",
      "spread": "4px",
      "color": "#ffffff"
    }
  ],
  "font.family.default": [
    "Noto Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif"
  ],
  "font.family.code": [
    "Noto Sans Mono",
    "SF Mono",
    "Monaco",
    "Cascadia Code",
    "Consolas",
    "monospace"
  ],
  "font.size.xs": "0.75rem",
  "font.size.sm": "0.875rem",
  "font.size.base": "1rem",
  "font.size.lg": "1.125rem",
  "font.size.xl": "1.25rem",
  "font.size.2xl": "1.5rem",
  "font.size.3xl": "1.875rem",
  "font.size.4xl": "2.25rem",
  "font.weight.regular": 400,
  "font.weight.normal": 400,
  "font.weight.medium": 500,
  "font.weight.semibold": 600,
  "font.weight.bold": 700,
  "font.lineHeight.tight": "1.25",
  "font.lineHeight.snug": "1.375",
  "font.lineHeight.normal": "1.5",
  "font.lineHeight.relaxed": "1.75",
  "font.letterSpacing.tight": "-0.01em",
  "font.letterSpacing.normal": "0em",
  "font.letterSpacing.wide": "0.025em",
  "font.letterSpacing.wider": "0.05em",
  "spacing.0": "0px",
  "spacing.1": "0.25rem",
  "spacing.2": "0.5rem",
  "spacing.3": "0.75rem",
  "spacing.4": "1rem",
  "spacing.5": "1.25rem",
  "spacing.6": "1.5rem",
  "spacing.8": "2rem",
  "spacing.10": "2.5rem",
  "spacing.12": "3rem",
  "spacing.16": "4rem",
  "spacing.20": "5rem",
  "radius.none": "0px",
  "radius.sm": "0.25rem",
  "radius.md": "0.375rem",
  "radius.lg": "0.5rem",
  "radius.xl": "0.75rem",
  "radius.full": "9999px",
  "radius.button": "0.375rem",
  "radius.input": "0.375rem",
  "radius.card": "0.5rem",
  "radius.modal": "0.75rem",
  "radius.badge": "9999px",
  "duration.fast": "150ms",
  "duration.normal": "250ms",
  "duration.slow": "350ms",
  "duration.entrance": "500ms",
  "easing.standard": [
    0.4,
    0,
    0.2,
    1
  ],
  "easing.decelerate": [
    0,
    0,
    0.2,
    1
  ],
  "easing.accelerate": [
    0.4,
    0,
    1,
    1
  ],
  "zIndex.dropdown": 100,
  "zIndex.sticky": 200,
  "zIndex.fixed": 300,
  "zIndex.modal-backdrop": 400,
  "zIndex.modal": 500,
  "zIndex.popover": 600,
  "zIndex.tooltip": 700,
  "zIndex.toast": 800,
  "opacity.disabled": 0.5,
  "opacity.subtle": 0.7,
  "opacity.overlay": 0.5,
  "blur.sm": "8px",
  "blur.md": "16px",
  "blur.lg": "24px",
  "blur.xl": "40px",
  "breakpoint.sm": "576px",
  "breakpoint.md": "768px",
  "breakpoint.lg": "992px",
  "breakpoint.xl": "1200px",
  "breakpoint.2xl": "1400px",
  "layout.header-height": "4rem",
  "layout.sidebar-width": "16rem",
  "layout.sidebar-collapsed": "4rem",
  "layout.content-max-width": "87.5rem",
  "layout.content-padding": "1.5rem"
} as const
