#!/usr/bin/env node
// =============================================================================
// scripts/strip-styles.mjs — Enforce the Force UI style allowlist.
//
// Force UI is a single-brand kit: only the `force-ui` style is valid in the
// v4 app + registry. Upstream shadcn/ui ships many demo/showcase styles
// (nova, vega, maia, lyra, mira, luma, sera, rhea, ...). After every upstream
// merge this script removes every non-allowlisted style from the v4 app so we
// stay brand-pure AND future syncs never re-introduce them by hand.
//
// It is idempotent: safe to run any time, a no-op when already clean.
//
// Scope: the v4 app + registry ONLY. The shadcn CLI package
// (packages/shadcn/src/preset/preset.ts) keeps the full PRESET_STYLES list
// because preset codes are bit-packed and reordering/removing styles there
// breaks backward-compatible decoding. Those styles are inert in the CLI and
// never leak into our published registry output.
//
// Usage: node scripts/strip-styles.mjs [--check]
//   --check : exit 1 if any non-allowlisted style is still present (CI guard)
// =============================================================================
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const V4 = path.join(ROOT, "apps/v4")

// The single allowed style. Add here only if the brand kit gains a real style.
const ALLOWLIST = new Set(["force-ui"])
// All upstream demo styles we strip. Keep in sync with shadcn PRESET_STYLES.
const UPSTREAM_STYLES = [
  "nova",
  "vega",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
]
const STRIP = UPSTREAM_STYLES.filter((s) => !ALLOWLIST.has(s))
const FRAMEWORK_BASES = ["radix", "base", "vue", "svelte", "ember"]

const CHECK = process.argv.includes("--check")
let dirty = false

function note(msg) {
  console.log(`[strip-styles] ${msg}`)
}

function rm(target) {
  if (!fs.existsSync(target)) return
  if (CHECK) {
    console.error(`[strip-styles] would remove: ${path.relative(ROOT, target)}`)
    dirty = true
    return
  }
  fs.rmSync(target, { recursive: true, force: true })
  note(`removed ${path.relative(ROOT, target)}`)
}

// 1. Generated style trees, registry output, per-style CSS, showcase routes.
for (const style of STRIP) {
  for (const base of FRAMEWORK_BASES) {
    rm(path.join(V4, "styles", `${base}-${style}`))
    rm(path.join(V4, "public/r/styles", `${base}-${style}`))
  }
  rm(path.join(V4, "registry/styles", `style-${style}.css`))
  rm(path.join(V4, "app/(app)/(styles)", style))
}

// 2. Filter flat object arrays (PRESETS in config.ts) by `style:` value.
function filterPresetArray(file, arrayDecl) {
  const abs = path.join(V4, file)
  if (!fs.existsSync(abs)) return
  const lines = fs.readFileSync(abs, "utf8").split("\n")
  const start = lines.findIndex((l) => l.includes(arrayDecl))
  if (start === -1) return

  const out = []
  let i = 0
  let removedAny = false
  for (; i <= start; i++) out.push(lines[i])

  // Walk array body until the closing `]` at base indentation.
  let block = []
  let inBlock = false
  for (i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!inBlock && /^\]/.test(line)) {
      out.push(line)
      i++
      break
    }
    // Section comments like `  // Luma.` — buffer; drop if next block dropped.
    if (!inBlock && /^\s*\/\//.test(line)) {
      block = [line]
      continue
    }
    if (!inBlock && /^\s*\{\s*$/.test(line)) {
      inBlock = true
      block.push(line)
      continue
    }
    if (inBlock) {
      block.push(line)
      if (/^\s*\},\s*$/.test(line)) {
        const styleMatch = block.find((b) => /^\s*style:\s*"/.test(b))
        const style = styleMatch?.match(/"([^"]+)"/)?.[1]
        if (style && STRIP.includes(style)) {
          removedAny = true // drop entire block (+ buffered comment)
        } else {
          out.push(...block)
        }
        block = []
        inBlock = false
      }
      continue
    }
    out.push(line)
  }
  for (; i < lines.length; i++) out.push(lines[i])

  if (removedAny) {
    if (CHECK) {
      console.error(`[strip-styles] ${file} still contains stripped presets`)
      dirty = true
      return
    }
    fs.writeFileSync(abs, out.join("\n"))
    note(`filtered ${arrayDecl} in ${file}`)
  }
}
filterPresetArray("registry/config.ts", "export const PRESETS")

// 3. Strip @custom-variant declarations for stripped styles in globals.css.
function stripGlobalsVariants() {
  const abs = path.join(V4, "app/globals.css")
  if (!fs.existsSync(abs)) return
  const before = fs.readFileSync(abs, "utf8")
  const after = before
    .split("\n")
    .filter(
      (l) =>
        !STRIP.some((s) =>
          new RegExp(`@custom-variant\\s+style-${s}\\b`).test(l)
        )
    )
    .join("\n")
  if (after !== before) {
    if (CHECK) {
      console.error(`[strip-styles] globals.css still has stripped variants`)
      dirty = true
      return
    }
    fs.writeFileSync(abs, after)
    note("removed @custom-variant declarations from globals.css")
  }
}
stripGlobalsVariants()

// 3b. Rewrite the style-registry.css aggregator to allowlisted styles only.
function rewriteStyleRegistryCss() {
  const abs = path.join(V4, "app/style-registry.css")
  if (!fs.existsSync(abs)) return
  const before = fs.readFileSync(abs, "utf8")
  const header = before.split("\n").filter((l) => l.startsWith("@reference"))
  const imports = [...ALLOWLIST].map(
    (s) => `@import "../registry/styles/style-${s}.css" layer(base);`
  )
  const after = [...header, "", ...imports, ""].join("\n")
  if (after !== before) {
    if (CHECK) {
      console.error(`[strip-styles] style-registry.css imports stripped styles`)
      dirty = true
      return
    }
    fs.writeFileSync(abs, after)
    note("rewrote app/style-registry.css to allowlisted styles")
  }
}
rewriteStyleRegistryCss()

// 4. Rewrite stripped-style import references to the allowed style.
// Upstream app pages/showcase import demo styles (@/styles/radix-nova/...).
// We point them at our single force-ui style so the app type-checks/builds.
const REWRITE_TARGET = "force-ui"
function rewriteStyleImports(dir) {
  const skip = new Set(["node_modules", ".next", "styles"])
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.name.startsWith(".") && entry.name !== ".") continue
      const abs = path.join(d, entry.name)
      if (entry.isDirectory()) {
        // Skip generated style trees (handled by removal above).
        if (d === V4 && skip.has(entry.name)) continue
        walk(abs)
        continue
      }
      if (!/\.(ts|tsx)$/.test(entry.name)) continue
      const before = fs.readFileSync(abs, "utf8")
      let after = before
      for (const style of STRIP) {
        after = after.replace(
          new RegExp(`@/styles/(radix|base)-${style}/`, "g"),
          `@/styles/$1-${REWRITE_TARGET}/`
        )
      }
      if (after !== before) {
        if (CHECK) {
          console.error(
            `[strip-styles] ${path.relative(ROOT, abs)} imports a stripped style`
          )
          dirty = true
          continue
        }
        fs.writeFileSync(abs, after)
        note(`rewrote style imports in ${path.relative(ROOT, abs)}`)
      }
    }
  }
  walk(dir)
}
rewriteStyleImports(V4)

if (CHECK && dirty) {
  console.error("[strip-styles] FAILED: non-allowlisted styles present.")
  process.exit(1)
}
note(CHECK ? "check passed — only allowlisted styles present." : "done.")
