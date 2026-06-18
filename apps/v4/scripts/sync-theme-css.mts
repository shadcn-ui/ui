/**
 * Syncs Force UI theme tokens from registry/themes.ts to CSS files.
 *
 * Usage: npx tsx scripts/sync-theme-css.mts
 *
 * Source of truth:
 *  - Palette (:root / .dark raw vars): registry/themes.ts (force-ui entry).
 *  - Tailwind theme mappings (`@theme inline` block): app/globals.css.
 *
 * Targets: app/globals.css and the framework preview servers
 *          (preview-{vue,svelte,ember}/src/styles.css).
 *
 * The preview servers iframe into the docs site, so they MUST carry the same
 * Force UI palette AND the same `@theme inline` token→utility mappings. If a
 * new semantic color (e.g. `--color-success`) is added to globals.css but not
 * the previews, framework demos using `bg-success` fail to build with
 * "Cannot apply unknown utility class". Mirroring the whole `@theme inline`
 * block from globals.css keeps the previews from drifting.
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

  console.log("Theme CSS synced successfully.")
}

main()
