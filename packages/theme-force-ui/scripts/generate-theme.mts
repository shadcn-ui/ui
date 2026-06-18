/**
 * Force UI theme generator
 *
 * Reads src/generated/tokens.ts (resolved Force Design Spec values) and
 * scripts/token-map.ts (the mapping config), then writes src/index.ts.
 *
 * Usage: pnpm generate-theme
 *
 * Output: src/index.ts — a RegistryItem with three cssVars sections:
 *   theme   @theme inline entries (Tailwind utility → CSS var)
 *   light   :root variables  (shadcn vars + Force extras + --force-* layer)
 *   dark    .dark variables  (same keys, dark-mode overrides applied)
 */

import { writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { light, dark } from "../src/generated/tokens.ts"
import {
  SHADCN_VARS,
  FORCE_EXTRAS,
  THEME_SPECIFIC,
  LITERAL_VARS,
  TAILWIND_THEME,
  BASE_RADIUS,
} from "./token-map.ts"

const __dir = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dir, "..")

// ── Shadow serialiser ─────────────────────────────────────────────────────────

type ShadowLayer = {
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
}

function shadowToCss(layers: ShadowLayer[]): string {
  return layers
    .map(({ offsetX, offsetY, blur, spread, color }) =>
      `${offsetX} ${offsetY} ${blur} ${spread} ${color}`,
    )
    .join(", ")
}

// ── Theme builder ─────────────────────────────────────────────────────────────

type TokenMap = Record<string, any>

function buildTheme(
  tokens: TokenMap,
  themeSpecific: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  let warnings = 0

  function resolve(varName: string, tokenKey: string): void {
    const value = tokens[tokenKey]
    if (value === undefined) {
      console.warn(`  ⚠  "${varName}": token "${tokenKey}" not found`)
      warnings++
      return
    }
    out[varName] = value as string
  }

  // 1. Standard shadcn variables
  for (const [varName, tokenKey] of Object.entries(SHADCN_VARS)) {
    resolve(varName, tokenKey)
  }

  // 2. Force-specific extras
  for (const [varName, tokenKey] of Object.entries(FORCE_EXTRAS)) {
    resolve(varName, tokenKey)
  }

  // 3. Theme-specific literals (may override earlier entries)
  for (const [varName, value] of Object.entries(themeSpecific)) {
    out[varName] = value
  }

  // 4. Literal vars (same in both themes)
  for (const [varName, value] of Object.entries(LITERAL_VARS)) {
    out[varName] = value
  }

  // 5. Elevation shadows (shadow.xs … shadow.xl → elevation-xs … elevation-xl)
  for (const size of ["xs", "sm", "md", "lg", "xl"]) {
    const key = `shadow.${size}`
    const layers = tokens[key]
    if (Array.isArray(layers)) {
      out[`elevation-${size}`] = shadowToCss(layers as ShadowLayer[])
    }
  }

  // 6. Base radius
  out["radius"] = BASE_RADIUS

  // 7. Full --force-* raw token layer (all resolved color.* semantic tokens)
  //    Gives component authors direct access to every Force semantic token.
  //    Non-color tokens (spacing, font, etc.) are handled by Tailwind utilities.
  for (const [tokenKey, value] of Object.entries(tokens)) {
    if (!tokenKey.startsWith("color.")) continue
    if (typeof value !== "string") continue
    // "color.bg.surface" → "force-color-bg-surface"
    out["force-" + tokenKey.replace(/\./g, "-")] = value
  }

  return out
}

// ── Build both themes ─────────────────────────────────────────────────────────

const lightVars = buildTheme(light as TokenMap, THEME_SPECIFIC.light)
const darkVars  = buildTheme(dark  as TokenMap, THEME_SPECIFIC.dark)

// ── Render helpers ────────────────────────────────────────────────────────────

function renderBlock(
  vars: Record<string, string>,
  indent: string,
): string {
  return Object.entries(vars)
    .map(([k, v]) => `${indent}"${k}": "${v}",`)
    .join("\n")
}

// ── Write src/index.ts ────────────────────────────────────────────────────────

const output = `// [FORCE-UI] Generated — do not edit manually.
// Run: pnpm generate-theme
// Source: packages/theme-force-ui/scripts/generate-theme.mts

import { type RegistryItem } from "shadcn/schema"

export const forceUITheme: RegistryItem = {
  name: "force-ui",
  title: "Force UI",
  type: "registry:theme",
  cssVars: {
    // @theme inline block — Tailwind utility → CSS var mapping
    theme: {
${renderBlock(TAILWIND_THEME, "      ")}
    },
    // :root — light theme values
    light: {
${renderBlock(lightVars, "      ")}
    },
    // .dark — dark theme overrides
    dark: {
${renderBlock(darkVars, "      ")}
    },
  },
}
`

writeFileSync(resolve(pkgRoot, "src/index.ts"), output)

// ── Summary ───────────────────────────────────────────────────────────────────

const forceCount = Object.keys(lightVars).filter((k) =>
  k.startsWith("force-"),
).length

console.log("✓  src/index.ts written")
console.log(`   @theme inline  ${Object.keys(TAILWIND_THEME).length} entries`)
console.log(`   :root          ${Object.keys(lightVars).length} variables  (${forceCount} --force-* raw tokens)`)
console.log(`   .dark          ${Object.keys(darkVars).length} variables`)
