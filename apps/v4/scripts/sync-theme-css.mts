/**
 * Syncs Force UI theme tokens from registry/themes.ts to CSS files.
 *
 * Usage: npx tsx scripts/sync-theme-css.mts
 *
 * Source of truth: registry/themes.ts (force-ui entry)
 * Targets: app/globals.css, preview-server/src/styles.css
 */
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { THEMES } from "../registry/themes.ts"

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const CSS_TARGETS = [
  path.join(ROOT_DIR, "app/globals.css"),
  path.join(ROOT_DIR, "preview-server/src/styles.css"),
]

function generateVarBlock(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")
}

function replaceBlock(
  css: string,
  selector: string,
  newContent: string
): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped}\\s*\\{)\\n[^}]*(\\})`, "s")
  const match = css.match(regex)
  if (!match) {
    throw new Error(`Could not find "${selector} { ... }" block`)
  }
  return css.replace(regex, `$1\n${newContent}\n$2`)
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

  for (const file of CSS_TARGETS) {
    let css = fs.readFileSync(file, "utf-8")
    css = replaceBlock(css, ":root", lightBlock)
    css = replaceBlock(css, ".dark", darkBlock)
    fs.writeFileSync(file, css, "utf-8")
    console.log(`Updated: ${path.relative(ROOT_DIR, file)}`)
  }

  console.log("Theme CSS synced successfully.")
}

main()
