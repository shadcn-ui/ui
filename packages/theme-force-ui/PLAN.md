# Token integration plan

How Force Design Spec tokens flow into the shadcn theme so that any project
using the standard `shadcn` CLI gets the correct variables automatically.

---

## The delivery mechanism (no CLI changes needed)

The shadcn `RegistryItem` schema has exactly three CSS slots:

| Slot | What the CLI writes to the user's file |
|---|---|
| `cssVars.theme` | `@theme inline { … }` — Tailwind utility → CSS var mapping |
| `cssVars.light` | `:root { … }` — light mode raw values |
| `cssVars.dark` | `.dark { … }` — dark mode overrides |

We fill all three from Force Design Spec tokens. No CLI modifications required.

---

## End-state: what a consumer's `globals.css` looks like after `npx shadcn add`

```css
/* shadcn writes this block ─────────────────────────────────────────── */
@theme inline {
  /* Standard shadcn Tailwind utilities */
  --color-background:  var(--background);
  --color-foreground:  var(--foreground);
  --color-primary:     var(--primary);
  /* … */

  /* Force-specific Tailwind utilities */
  --shadow-xs:                var(--elevation-xs);
  --shadow-sm:                var(--elevation-sm);
  --shadow-md:                var(--elevation-md);
  --shadow-lg:                var(--elevation-lg);
  --shadow-xl:                var(--elevation-xl);
  --shadow-focus-ring:        0 0 0 2px var(--background), 0 0 0 4px var(--primary);
  --shadow-focus-ring-error:  0 0 0 2px var(--background), 0 0 0 4px var(--destructive);
  --shadow-focus-ring-on-brand: 0 0 0 2px var(--primary),  0 0 0 4px var(--background);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  /* ── Standard shadcn variables (values from Force Design Spec) ─────── */
  --background:              #ffffff;   /* color.bg.surface          */
  --foreground:              #000000;   /* color.text.primary        */
  --card:                    #ffffff;   /* color.bg.surface          */
  --card-foreground:         #000000;   /* color.text.primary        */
  --popover:                 #ffffff;
  --popover-foreground:      #000000;
  --primary:                 #5405ff;   /* color.bg.primary          */
  --primary-foreground:      #ffffff;   /* color.text.on-primary     */
  --secondary:               #f8f8fd;   /* color.bg.muted            */
  --secondary-foreground:    #000000;
  --muted:                   #f8f8fd;
  --muted-foreground:        #525260;   /* color.text.tertiary       */
  --accent:                  #f0e8ff;   /* color.bg.interactive-active */
  --accent-foreground:       #3b00bf;   /* color.text.interactive-active */
  --destructive:             #d11323;   /* color.bg.destructive      */
  --border:                  #e9e9ee;   /* color.border.default      */
  --input:                   #717180;   /* color.border.input        */
  --ring:                    #5405ff;   /* color.border.focus        */
  --chart-1:                 #5405ff;
  --chart-2:                 #00cfff;
  /* … */
  --radius:                  0.375rem;  /* radius.md = 6px           */

  /* ── Force-specific extras ─────────────────────────────────────────── */
  /* Elevation shadows (two-layer, Force spec shadow.xs … xl) */
  --elevation-xs: 0 1px 2px 0 #00000014, 0 0 2px 0 #0000001a;
  --elevation-sm: 0 2px 4px 0 #0000001a, 0 0 2px 0 #00000014;
  --elevation-md: 0 4px 8px 0 #0000001a, 0 0 4px 0 #00000014;
  --elevation-lg: 0 8px 16px 0 #0000001a, 0 0 8px 0 #00000014;
  --elevation-xl: 0 16px 32px 0 #0000001f, 0 0 16px 0 #00000014;

  /* Status semantic colours */
  --primary-hover:    #4400d8;          /* color.bg.primary-hover    */
  --primary-subtle:   #f0e8ff;          /* color.bg.primary-subtle   */
  --warning:          #c14f0a;          /* color.text.warning        */
  --success:          #0f660f;          /* color.text.success        */
  --info:             #0066b5;          /* color.text.info           */
  --error:            #a30e1c;          /* color.text.error          */
  --warning-subtle:   #fffbf7;
  --success-subtle:   #f3fcf3;
  --info-subtle:      #f5fbfe;
  --error-subtle:     #fdf5f6;
  /* … */

  /* ── Full --force-* raw token layer ────────────────────────────────── */
  /* Every Force Design Spec semantic token, prefixed --force-*           */
  /* Component authors and design-system consumers reference these.       */
  --force-color-bg-surface:         #ffffff;
  --force-color-bg-muted:           #f8f8fd;
  --force-color-text-primary:       #000000;
  /* … all 160 semantic tokens … */
}

.dark {
  --background:   #26262e;
  --foreground:   #f8f8fd;
  --primary:      #00cfff;   /* cyan in dark mode */
  /* … */
  --elevation-xs: 0 1px 2px 0 #00000033, 0 0 2px 0 #00000040;
  /* … */
  --force-color-bg-surface: #26262e;
  /* … */
}
```

---

## Pipeline

```
tokens/                           ← source files (spec repo, committed here)
  primitives.tokens.json
  semantic-light.tokens.json
  semantic-dark.tokens.json
        │
        ▼  pnpm parse-tokens  (already done)
src/generated/tokens.ts           ← flat resolved maps: light{}, dark{}, primitives{}
        │
        ▼  pnpm generate-theme  (to build)
src/index.ts (cssVars)            ← RegistryItem consumed by apps/v4/registry/themes.ts
  .theme   → @theme inline
  .light   → :root
  .dark    → .dark
```

---

## Files to create / modify

### 1. `scripts/token-map.ts` — the mapping (manual, source of truth)

Two exports:

```typescript
// Force semantic token key → shadcn variable name
// Values come from src/generated/tokens.ts light{} / dark{}
export const SHADCN_VARS: Record<string, string> = {
  "color.bg.surface":             "background",
  "color.text.primary":           "foreground",
  // card mirrors surface
  "color.bg.surface":             "card",
  "color.text.primary":           "card-foreground",
  "color.bg.primary":             "primary",
  "color.text.on-primary":        "primary-foreground",
  "color.bg.muted":               "secondary",
  // …
}

// Additional Force-specific variables added to :root (not in SHADCN_VARS)
// Key = CSS variable name (without --), value = token key or literal
export const FORCE_EXTRAS_LIGHT: Record<string, string> = {
  "primary-hover":    "color.bg.primary-hover",
  "primary-subtle":   "color.bg.primary-subtle",
  "warning":          "color.text.warning",
  "success":          "color.text.success",
  "info":             "color.text.info",
  "error":            "color.text.error",
  "warning-subtle":   "color.bg.warning-subtle",
  // … elevation shadows are literals, not token refs:
  "elevation-xs": "0 1px 2px 0 #00000014, 0 0 2px 0 #0000001a",
  // …
}

// @theme inline block — Tailwind utility name → var() expression
// This is cssVars.theme in the RegistryItem
export const TAILWIND_THEME: Record<string, string> = {
  "--color-background":   "var(--background)",
  "--color-foreground":   "var(--foreground)",
  "--color-primary":      "var(--primary)",
  // …
  "--shadow-xs":          "var(--elevation-xs)",
  "--shadow-sm":          "var(--elevation-sm)",
  // focus rings are literals (they compose two vars):
  "--shadow-focus-ring":
    "0 0 0 2px var(--background), 0 0 0 4px var(--primary)",
  "--shadow-focus-ring-error":
    "0 0 0 2px var(--background), 0 0 0 4px var(--destructive)",
  "--shadow-focus-ring-on-brand":
    "0 0 0 2px var(--primary), 0 0 0 4px var(--background)",
  "--radius-lg": "var(--radius)",
  "--radius-md": "calc(var(--radius) - 2px)",
  "--radius-sm": "calc(var(--radius) - 4px)",
  "--radius-xl": "calc(var(--radius) + 4px)",
}
```

---

### 2. `scripts/generate-theme.mts` — the generator

Reads `tokens.ts` + `token-map.ts`, writes `src/index.ts`:

```
light / dark raw resolved values
    + SHADCN_VARS mapping         → cssVars.light / dark  (shadcn variables)
    + FORCE_EXTRAS_LIGHT/DARK     → cssVars.light / dark  (elevation, status…)
    + all light/dark keys         → cssVars.light / dark  (--force-* layer)
    + TAILWIND_THEME              → cssVars.theme          (@theme inline)
```

Shadow tokens (arrays of layers) get serialised to a single CSS
`box-shadow` string: `"0 Ypx Bpx Spx COLOR, 0 0 Bpx 0 COLOR"`.

---

### 3. `src/index.ts` — becomes generated output

The file will be written by `generate-theme.mts` and should not be edited
by hand. It stays a `RegistryItem`; only the values inside `cssVars` change.

Add a `[FORCE-UI]` header comment so upstream merges don't clobber it:

```typescript
// [FORCE-UI] Generated — do not edit manually.
// Run: pnpm generate-theme
```

---

## pnpm scripts to add

```jsonc
// packages/theme-force-ui/package.json
"scripts": {
  "parse-tokens":    "tsx scripts/parse-tokens.mts",
  "generate-theme":  "tsx scripts/generate-theme.mts",
  "sync-tokens":     "pnpm parse-tokens && pnpm generate-theme"
}
```

Run `pnpm sync-tokens` any time the spec repo changes.

---

## What is NOT in scope

- Modifying the shadcn CLI
- Modifying `apps/v4/registry/themes.ts` directly — it already imports
  `forceUITheme` from `@force-ui/theme`; only `src/index.ts` changes
- Adding a separate CSS file to the registry — everything ships via
  `cssVars` in the single `RegistryItem`
