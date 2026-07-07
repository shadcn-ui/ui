/**
 * Force UI token mapping
 *
 * Single source of truth for how Force Design Spec semantic tokens map to
 * CSS variable names. No logic lives here — only data.
 *
 * SHADCN_VARS   Standard shadcn variable names → Force token key
 * FORCE_EXTRAS  Force-specific extras → Force token key (same key, both themes)
 * THEME_SPECIFIC Values that differ per theme but aren't token-key lookups
 * LITERAL_VARS  Same value in both themes (var() refs, etc.)
 * TAILWIND_THEME @theme inline entries (without leading --)
 * BASE_RADIUS   Base --radius value. calc() steps in TAILWIND_THEME are
 *               relative to this:
 *                 --radius-lg = var(--radius)             = 8px  cards
 *                 --radius-md = calc(var(--radius) - 2px) = 6px  buttons/inputs
 *                 --radius-sm = calc(var(--radius) - 4px) = 4px  badges
 *                 --radius-xl = calc(var(--radius) + 4px) = 12px modals
 */

// ── Standard shadcn variables ─────────────────────────────────────────────────
// Key: shadcn CSS variable name (no leading --).
// Value: Force Design Spec token key in src/generated/tokens.ts light{}/dark{}.

export const SHADCN_VARS: Record<string, string> = {
  // Surfaces & text
  "background":                    "color.bg.surface",
  "foreground":                    "color.text.primary",
  "card":                          "color.bg.surface",
  "card-foreground":               "color.text.primary",
  "popover":                       "color.bg.surface",
  "popover-foreground":            "color.text.primary",

  // Primary brand
  "primary":                       "color.bg.primary",
  "primary-foreground":            "color.text.on-primary",

  // Secondary / muted surfaces
  "secondary":                     "color.bg.muted",
  "secondary-foreground":          "color.text.primary",
  "muted":                         "color.bg.muted",
  "muted-foreground":              "color.text.tertiary",

  // Accent (interactive-active: indigo-50 light / deep-cyan dark)
  "accent":                        "color.bg.interactive-active",
  "accent-foreground":             "color.text.interactive-active",

  // Destructive
  "destructive":                   "color.bg.destructive",
  "destructive-foreground":        "color.text.on-error",

  // Borders & inputs
  "border":                        "color.border.default",
  "input":                         "color.border.input",
  "ring":                          "color.border.focus",
  "outline":                       "color.border.primary",

  // Charts
  "chart-1":                       "color.chart.1",
  "chart-2":                       "color.chart.2",
  "chart-3":                       "color.chart.3",
  "chart-4":                       "color.chart.4",
  "chart-5":                       "color.chart.5",

  // Sidebar (maps to nav chrome tokens)
  "sidebar":                       "color.bg.emphasis",
  "sidebar-foreground":            "color.text.primary",
  "sidebar-primary":               "color.bg.primary",
  "sidebar-primary-foreground":    "color.text.on-primary",
  "sidebar-accent":                "color.bg.interactive-hover",
  "sidebar-accent-foreground":     "color.text.primary-brand",
  "sidebar-border":                "color.border.default",
  "sidebar-ring":                  "color.border.focus",
}

// ── Force-specific extras ─────────────────────────────────────────────────────
// CSS var name → Force token key. Resolved against light{} or dark{}
// exactly like SHADCN_VARS, but these aren't part of shadcn's standard set.

export const FORCE_EXTRAS: Record<string, string> = {
  // Interactive states
  "primary-hover":             "color.bg.primary-hover",
  "primary-subtle":            "color.bg.primary-subtle",
  "link":                      "color.text.link",
  "tertiary":                  "color.text.tertiary",

  // Status text/icon accents (used as text-* utilities)
  "warning":                   "color.text.warning",
  "success":                   "color.text.success",
  "info":                      "color.text.info",
  "error":                     "color.text.error",

  // Subtle status backgrounds (alert/callout containers)
  "warning-subtle":            "color.bg.warning-subtle",
  "success-subtle":            "color.bg.success-subtle",
  "info-subtle":               "color.bg.info-subtle",
  "error-subtle":              "color.bg.error-subtle",

  // Solid status fills (strong badges/banners)
  "success-solid":             "color.bg.success",
  "warning-solid":             "color.bg.warning",
  "info-solid":                "color.bg.info",

  // On-status foregrounds
  "on-success":                "color.text.on-success",
  "on-warning":                "color.text.on-warning",
  "on-info":                   "color.text.on-info",
  "on-error":                  "color.text.on-error",

  // Sixth chart colour
  "chart-6":                   "color.chart.6",

  // Code block surface
  "surface":                   "color.bg.muted",
  "surface-foreground":        "color.text.tertiary",
  "code-number":               "color.text.tertiary",

  // Text selection highlight
  "selection":                 "color.bg.primary",
  "selection-foreground":      "color.text.on-primary",
}

// ── Theme-specific literals ───────────────────────────────────────────────────
// Values that differ between light and dark but aren't a token key lookup.
// Written after FORCE_EXTRAS so they can override if needed.

export const THEME_SPECIFIC: {
  light: Record<string, string>
  dark: Record<string, string>
} = {
  light: {
    // Slightly darker than surface (#f8f8fd) for code block highlight rows
    "code-highlight": "#ededf2",
  },
  dark: {
    // Slightly lighter than dark surface (#26262e)
    "code-highlight": "#2d2d36",
  },
}

// ── Literal vars (same in both themes) ───────────────────────────────────────
// Written as-is into both :root and .dark.

export const LITERAL_VARS: Record<string, string> = {
  "code":             "var(--surface)",
  "code-foreground":  "var(--surface-foreground)",
}

// ── Base radius ───────────────────────────────────────────────────────────────
// radius.lg = 8px — the calc() steps in TAILWIND_THEME are relative to this.
export const BASE_RADIUS = "0.5rem"

// ── Tailwind @theme inline ────────────────────────────────────────────────────
// Goes into cssVars.theme → written into @theme inline { } on install.
// Keys are WITHOUT the leading -- (the shadcn CLI adds it).
// Values are var() expressions or calc() literals — NOT resolved against tokens.

export const TAILWIND_THEME: Record<string, string> = {
  // ── Standard shadcn color utilities ──────────────────────────────────────
  "color-background":                "var(--background)",
  "color-foreground":                "var(--foreground)",
  "color-card":                      "var(--card)",
  "color-card-foreground":           "var(--card-foreground)",
  "color-popover":                   "var(--popover)",
  "color-popover-foreground":        "var(--popover-foreground)",
  "color-primary":                   "var(--primary)",
  "color-primary-foreground":        "var(--primary-foreground)",
  "color-secondary":                 "var(--secondary)",
  "color-secondary-foreground":      "var(--secondary-foreground)",
  "color-muted":                     "var(--muted)",
  "color-muted-foreground":          "var(--muted-foreground)",
  "color-accent":                    "var(--accent)",
  "color-accent-foreground":         "var(--accent-foreground)",
  "color-destructive":               "var(--destructive)",
  "color-border":                    "var(--border)",
  "color-input":                     "var(--input)",
  "color-ring":                      "var(--ring)",
  "color-chart-1":                   "var(--chart-1)",
  "color-chart-2":                   "var(--chart-2)",
  "color-chart-3":                   "var(--chart-3)",
  "color-chart-4":                   "var(--chart-4)",
  "color-chart-5":                   "var(--chart-5)",
  "color-sidebar":                   "var(--sidebar)",
  "color-sidebar-foreground":        "var(--sidebar-foreground)",
  "color-sidebar-primary":           "var(--sidebar-primary)",
  "color-sidebar-primary-foreground":"var(--sidebar-primary-foreground)",
  "color-sidebar-accent":            "var(--sidebar-accent)",
  "color-sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
  "color-sidebar-border":            "var(--sidebar-border)",
  "color-sidebar-ring":              "var(--sidebar-ring)",

  // ── Force-specific color utilities ───────────────────────────────────────
  "color-primary-hover":             "var(--primary-hover)",
  "color-primary-subtle":            "var(--primary-subtle)",
  "color-link":                      "var(--link)",
  "color-tertiary":                  "var(--tertiary)",
  "color-warning":                   "var(--warning)",
  "color-success":                   "var(--success)",
  "color-info":                      "var(--info)",
  "color-error":                     "var(--error)",
  "color-warning-subtle":            "var(--warning-subtle)",
  "color-success-subtle":            "var(--success-subtle)",
  "color-info-subtle":               "var(--info-subtle)",
  "color-error-subtle":              "var(--error-subtle)",
  "color-success-solid":             "var(--success-solid)",
  "color-warning-solid":             "var(--warning-solid)",
  "color-info-solid":                "var(--info-solid)",
  "color-on-success":                "var(--on-success)",
  "color-on-warning":                "var(--on-warning)",
  "color-on-info":                   "var(--on-info)",
  "color-on-error":                  "var(--on-error)",
  "color-chart-6":                   "var(--chart-6)",
  "color-surface":                   "var(--surface)",
  "color-surface-foreground":        "var(--surface-foreground)",
  "color-selection":                 "var(--selection)",
  "color-selection-foreground":      "var(--selection-foreground)",

  // ── Radius (relative steps from --radius base) ────────────────────────────
  "radius-lg": "var(--radius)",
  "radius-md": "calc(var(--radius) - 2px)",
  "radius-sm": "calc(var(--radius) - 4px)",
  "radius-xl": "calc(var(--radius) + 4px)",

  // ── Elevation shadows ─────────────────────────────────────────────────────
  // Bound to --elevation-* vars so dark overrides take effect at runtime.
  // Use per spec: xs=dropdowns, sm=popovers, md=panels, lg=modals, xl=wizards.
  "shadow-xs": "var(--elevation-xs)",
  "shadow-sm": "var(--elevation-sm)",
  "shadow-md": "var(--elevation-md)",
  "shadow-lg": "var(--elevation-lg)",
  "shadow-xl": "var(--elevation-xl)",

  // ── Focus rings ───────────────────────────────────────────────────────────
  // Two-stop spread shadows; compose runtime vars so no separate dark block needed.
  //   focus-ring          on standard surfaces (indigo band in light, cyan in dark)
  //   focus-ring-error    focused inputs in validation-error state
  //   focus-ring-on-brand elements sitting on bg.primary
  "shadow-focus-ring":
    "0 0 0 2px var(--background), 0 0 0 4px var(--primary)",
  "shadow-focus-ring-error":
    "0 0 0 2px var(--background), 0 0 0 4px var(--destructive)",
  "shadow-focus-ring-on-brand":
    "0 0 0 2px var(--primary), 0 0 0 4px var(--background)",
}
