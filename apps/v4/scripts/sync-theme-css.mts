/**
 * Syncs Force UI theme tokens from registry/themes.ts to CSS files.
 *
 * Usage: npx tsx scripts/sync-theme-css.mts
 *
 * Source of truth:
 *  - Palette (:root / .dark raw vars): registry/themes.ts (force-ui entry).
 *  - Tailwind theme mappings (`@theme inline` block): app/globals.css.
 *  - Color accent themes: registry/themes.ts (all non-force-ui entries).
 *
 * Targets:
 *  - app/globals.css — :root / .dark / @theme inline
 *  - preview-{vue,svelte,ember}/src/styles.css — same as globals.css
 *  - app/legacy-themes.css — standalone .theme-{name} blocks (generated section)
 *
 * The preview servers iframe into the docs site, so they MUST carry the same
 * Force UI palette AND the same `@theme inline` token→utility mappings. If a
 * new semantic color (e.g. `--color-success`) is added to globals.css but not
 * the previews, framework demos using `bg-success` fail to build with
 * "Cannot apply unknown utility class". Mirroring the whole `@theme inline`
 * block from globals.css keeps the previews from drifting.
 *
 * legacy-themes.css contains a generated section delimited by:
 *   [FORCE-UI-GENERATED-START] ... [FORCE-UI-GENERATED-END]
 * This section is fully replaced on every run. Hand-authored modifier themes
 * (theme-sketch, .theme-X .theme-container chart overrides, font/radius
 * modifiers) live outside the markers and are never touched.
 */
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { THEMES } from "../registry/themes.ts"

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const GLOBALS_CSS = path.join(ROOT_DIR, "app/globals.css")

// [FORCE-UI] Framework preview servers (Vue/Svelte/Ember). These iframe into
// the docs site and must carry the same Force UI :root/.dark palette and the
// same `@theme inline` mappings as app/globals.css.
const PREVIEW_TARGETS = [
  path.join(ROOT_DIR, "../preview-vue/src/styles.css"),
  path.join(ROOT_DIR, "../preview-svelte/src/styles.css"),
  path.join(ROOT_DIR, "../preview-ember/src/styles.css"),
]

const CSS_TARGETS = [GLOBALS_CSS, ...PREVIEW_TARGETS]

const LEGACY_THEMES_CSS = path.join(ROOT_DIR, "app/legacy-themes.css")
const GENERATED_START = "/* [FORCE-UI-GENERATED-START]"
const GENERATED_END = "/* [FORCE-UI-GENERATED-END] */"

function generateVarBlock(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")
}

function blockRegex(selector: string): RegExp {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  // `@theme inline` / `:root` / `.dark` bodies contain no nested braces, so a
  // non-greedy match up to the first `}` is safe.
  return new RegExp(`(${escaped}\\s*\\{)\\n[^}]*(\\})`, "s")
}

function replaceBlock(
  css: string,
  selector: string,
  newContent: string
): string {
  const regex = blockRegex(selector)
  if (!regex.test(css)) {
    throw new Error(`Could not find "${selector} { ... }" block`)
  }
  return css.replace(regex, `$1\n${newContent}\n$2`)
}

function extractBlockBody(css: string, selector: string): string {
  const match = css.match(blockRegex(selector))
  if (!match) {
    throw new Error(`Could not find "${selector} { ... }" block`)
  }
  // Strip the opening `{...\n` and trailing `\n}` captured groups.
  return match[0].slice(match[1].length).replace(/\n[^\n]*$/, "").replace(/^\n/, "")
}

/** Generate a .theme-{name} { ... @variant dark { ... } } block from a theme's cssVars. */
function generateThemeBlock(name: string, light: Record<string, string>, dark: Record<string, string>): string {
  const lightVars = Object.entries(light)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n")
  const darkVars = Object.entries(dark)
    .map(([k, v]) => `    --${k}: ${v};`)
    .join("\n")
  return `.theme-${name} {\n${lightVars}\n\n  @variant dark {\n${darkVars}\n  }\n}`
}

/** Replace the [FORCE-UI-GENERATED-START]...[FORCE-UI-GENERATED-END] section. */
function regenerateLegacyThemes(css: string, themes: typeof THEMES): string {
  const startIdx = css.indexOf(GENERATED_START)
  const endIdx = css.indexOf(GENERATED_END)
  if (startIdx === -1 || endIdx === -1) {
    throw new Error("[FORCE-UI-GENERATED-START/END] markers not found in legacy-themes.css")
  }

  const header = css.slice(0, startIdx)
  const footer = css.slice(endIdx + GENERATED_END.length)

  const blocks = themes
    .filter((t) => t.name !== "force-ui" && t.cssVars?.light && t.cssVars?.dark)
    .map((t) =>
      generateThemeBlock(
        t.name,
        t.cssVars!.light as Record<string, string>,
        t.cssVars!.dark as Record<string, string>
      )
    )
    .join("\n\n")

  const generated =
    `${GENERATED_START} standalone .theme-{name} blocks — edit registry/themes.ts, then run pnpm theme:sync */\n\n` +
    blocks +
    `\n\n${GENERATED_END}`

  return header + generated + footer
}

function main() {
  const forceUi = THEMES.find((t) => t.name === "force-ui")
  if (!forceUi?.cssVars?.light || !forceUi?.cssVars?.dark) {
    throw new Error("force-ui theme not found or missing cssVars")
  }

  const light = forceUi.cssVars.light as Record<string, string>
  const dark = forceUi.cssVars.dark as Record<string, string>

  const lightBlock = generateVarBlock(light)
  const darkBlock = generateVarBlock(dark)

  // app/globals.css owns the canonical `@theme inline` block (token→utility
  // mappings, including hand-maintained breakpoints, fonts and custom colors).
  // Mirror it verbatim into the framework previews so they never drift.
  const globalsCss = fs.readFileSync(GLOBALS_CSS, "utf-8")
  const themeBlock = extractBlockBody(globalsCss, "@theme inline")

  for (const file of CSS_TARGETS) {
    let css = fs.readFileSync(file, "utf-8")
    css = replaceBlock(css, ":root", lightBlock)
    css = replaceBlock(css, ".dark", darkBlock)
    if (PREVIEW_TARGETS.includes(file)) {
      css = replaceBlock(css, "@theme inline", themeBlock)
    }
    fs.writeFileSync(file, css, "utf-8")
    console.log(`Updated: ${path.relative(ROOT_DIR, file)}`)
  }

  // Regenerate .theme-{name} standalone blocks in legacy-themes.css
  const legacyCss = fs.readFileSync(LEGACY_THEMES_CSS, "utf-8")
  const updatedLegacy = regenerateLegacyThemes(legacyCss, THEMES)
  fs.writeFileSync(LEGACY_THEMES_CSS, updatedLegacy, "utf-8")
  console.log(`Updated: app/legacy-themes.css (${THEMES.filter((t) => t.name !== "force-ui").length} themes)`)

  console.log("Theme CSS synced successfully.")
}

main()
