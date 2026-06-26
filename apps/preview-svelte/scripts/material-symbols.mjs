#!/usr/bin/env node
/**
 * Svelte Material Symbols tooling (source: @material-symbols/svg-400, rounded).
 *  - direct `@lucide/svelte/icons/<kebab>` default imports -> `~icons/ms/<base>`
 *    (unplugin-icons FileSystemIconLoader; identifier kept, markup unchanged).
 *  - `<IconPlaceholder lucide="...">` -> inject `materialSymbols="<base>"`;
 *    icon-placeholder.svelte renders it from a generated inline registry.
 *
 *   node scripts/material-symbols.mjs map|codemod|check
 */
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SV_ROOT = path.resolve(__dirname, "..")
const REPO_ROOT = path.resolve(SV_ROOT, "../..")
const REACT_MAP = JSON.parse(
  fs.readFileSync(
    path.join(REPO_ROOT, "apps/v4/registry/icons/material-symbols-map.json"),
    "utf-8"
  )
)
const ROUNDED_DIR = path.join(
  path.dirname(require.resolve("@material-symbols/svg-400/package.json")),
  "rounded"
)
const MAP_OUT = path.join(SV_ROOT, "scripts/material-symbols-map.json")
const REGISTRY_OUT = path.join(
  SV_ROOT,
  "src/svelte-components/icon-placeholder/material-symbols.ts"
)
const SCAN_DIRS = [
  path.join(REPO_ROOT, "packages/registry-svelte"),
  path.join(SV_ROOT, "src"),
]
const DIRECT_RE = /import\s+(\w+)\s+from\s*["']@lucide\/svelte\/icons\/([a-z0-9-]+)["'];?/g
const PLACEHOLDER_LUCIDE_RE = /lucide="([^"]+)"/g

const existsSvg = (base) => fs.existsSync(path.join(ROUNDED_DIR, `${base}.svg`))
const pascalToBase = (lucide) => {
  const withIcon = lucide.endsWith("Icon") ? lucide : `${lucide}Icon`
  return REACT_MAP[withIcon] ?? REACT_MAP[lucide] ?? null
}
const kebabToPascal = (k) =>
  k.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")

// Names (kebab or Pascal) not covered by the React map -> svg-400 base.
const OVERRIDES = {
  "chevrons-up-down": "unfold_more",
  "chevrons-left": "keyboard_double_arrow_left",
  "chevrons-right": "keyboard_double_arrow_right",
  "panel-left": "left_panel_open",
  "more-horizontal": "more_horiz",
  "more-vertical": "more_vert",
  "grip-vertical": "drag_indicator",
  "arrow-up-down": "swap_vert",
  "calendar-days": "calendar_month",
  "calendar-plus": "calendar_add_on",
  "code-2": "code",
  "git-branch": "account_tree",
  "dollar-sign": "attach_money",
  paperclip: "attach_file",
  "list-filter": "filter_list",
  "list-filter-plus": "filter_list",
  "corner-down-left": "subdirectory_arrow_left",
  slash: "block",
  "at-sign": "alternate_email",
  popcorn: "theaters",
  "square-terminal": "terminal",
  "shield-alert": "gpp_maybe",
  "circle-check-big": "check_circle",
  "circle-fading-arrow-up": "change_circle",
  clock: "schedule",
  dot: "fiber_manual_record",
  "link-2": "link",
  "mail-check": "mark_email_read",
  "refresh-ccw": "refresh",
  truck: "local_shipping",
  "book-user": "contacts",
  x: "close",
  minus: "remove",
  plus: "add",
  "circle-arrow-up": "arrow_circle_up",
  "circle-x": "cancel",
  ellipsis: "more_horiz",
  "panel-left-close": "left_panel_close",
  "panel-left-open": "left_panel_open",
  tags: "label",
}

const heuristicFromKebab = (k) => k.replace(/-/g, "_")
const heuristicFromPascal = (p) =>
  p.replace(/Icon$/, "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()

function resolveBase(name) {
  if (OVERRIDES[name] && existsSvg(OVERRIDES[name])) return OVERRIDES[name]
  const isKebab = name.includes("-") || /^[a-z0-9]+$/.test(name)
  let base
  if (isKebab) {
    base = pascalToBase(kebabToPascal(name)) ?? heuristicFromKebab(name)
  } else {
    base = pascalToBase(name) ?? heuristicFromPascal(name)
  }
  return existsSvg(base) ? base : null
}

function eachFile(fn) {
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.name === "node_modules" || entry.name === "dist") continue
      if (entry.isDirectory()) walk(full)
      else if (/\.(svelte|ts)$/.test(entry.name)) fn(full)
    }
  }
  SCAN_DIRS.forEach(walk)
}

function collect() {
  const direct = new Set()
  const placeholder = new Set()
  eachFile((file) => {
    const content = fs.readFileSync(file, "utf-8")
    let m
    DIRECT_RE.lastIndex = 0
    while ((m = DIRECT_RE.exec(content)) !== null) direct.add(m[2])
    PLACEHOLDER_LUCIDE_RE.lastIndex = 0
    while ((m = PLACEHOLDER_LUCIDE_RE.exec(content)) !== null) placeholder.add(m[1])
  })
  return { direct: [...direct].sort(), placeholder: [...placeholder].sort() }
}

function buildMap() {
  const { direct, placeholder } = collect()
  const all = [...new Set([...direct, ...placeholder])].sort()
  const map = {}
  const misses = []
  for (const n of all) {
    const base = resolveBase(n)
    if (base) map[n] = base
    else misses.push(n)
  }
  return { all, map, misses, placeholder }
}

function svgInner(base) {
  const svg = fs.readFileSync(path.join(ROUNDED_DIR, `${base}.svg`), "utf-8")
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 -960 960 960"
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim()
  return { viewBox, inner }
}

function writeRegistry(map, placeholder) {
  const bases = [...new Set(placeholder.map((n) => map[n]))].sort()
  const entries = bases
    .map((base) => {
      const { viewBox, inner } = svgInner(base)
      return `  "${base}": { viewBox: "${viewBox}", body: ${JSON.stringify(inner)} },`
    })
    .join("\n")
  const content = `// Auto-generated by scripts/material-symbols.mjs — inlined @material-symbols/svg-400 (rounded).
export const materialSymbols: Record<string, { viewBox: string; body: string }> = {
${entries}
}
`
  fs.writeFileSync(REGISTRY_OUT, content)
}

function cmdMap({ write = true } = {}) {
  const { all, map, misses, placeholder } = buildMap()
  console.log(`svelte names: ${all.length} | mapped: ${Object.keys(map).length} | MISS: ${misses.length}`)
  if (misses.length) {
    console.log("\n⚠ Unmapped (add to OVERRIDES):")
    misses.forEach((m) => console.log(`  - ${m}`))
    return false
  }
  if (write) {
    fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2) + "\n")
    writeRegistry(map, placeholder)
    console.log(`\n✓ Wrote ${Object.keys(map).length} entries + placeholder registry.`)
  }
  return true
}

function cmdCodemod({ check = false } = {}) {
  const { map, misses } = buildMap()
  if (misses.length) {
    console.error("Map incomplete; run `map` and fix OVERRIDES first.")
    process.exit(1)
  }
  let direct = 0
  let placeholders = 0
  eachFile((file) => {
    let content = fs.readFileSync(file, "utf-8")
    const before = content
    content = content.replace(DIRECT_RE, (_w, local, kebab) => {
      direct++
      return `import ${local} from "~icons/ms/${map[kebab]}";`
    })
    content = content.replace(PLACEHOLDER_LUCIDE_RE, (whole, name, offset, str) => {
      const head = str.slice(offset).split(/\/?>/)[0]
      if (/materialSymbols=/.test(head)) return whole
      placeholders++
      return `${whole}\n\t\tmaterialSymbols="${map[name]}"`
    })
    if (content !== before && !check) fs.writeFileSync(file, content)
  })
  if (check) {
    let leftover = 0
    eachFile((file) => {
      if (/from\s*["']@lucide\/svelte/.test(fs.readFileSync(file, "utf-8"))) leftover++
    })
    if (leftover) {
      console.error(`${leftover} file(s) still import @lucide/svelte.`)
      process.exit(1)
    }
    console.log("✓ No @lucide/svelte imports remain.")
    return
  }
  console.log(`✓ Rewrote ${direct} direct import(s) + injected ${placeholders} placeholder prop(s).`)
}

const cmd = process.argv[2]
if (cmd === "map") process.exit(cmdMap() ? 0 : 1)
else if (cmd === "codemod") cmdCodemod()
else if (cmd === "check") {
  if (!cmdMap({ write: false })) process.exit(1)
  cmdCodemod({ check: true })
} else {
  console.error("usage: material-symbols.mjs <map|codemod|check>")
  process.exit(1)
}
