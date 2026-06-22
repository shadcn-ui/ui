#!/usr/bin/env node
/**
 * Vue Material Symbols tooling (source: @material-symbols/svg-400, rounded).
 *  - direct `lucide-vue-next` named imports -> per-icon
 *    `@material-symbols/svg-400/rounded/<base>.svg?component` (vite-svg-loader;
 *    local identifier kept, template markup unchanged).
 *  - `<IconPlaceholder lucide="...">` -> inject `materialSymbols="<base>"`;
 *    IconPlaceholder.vue resolves it from a generated inline svg registry.
 *
 *   node scripts/material-symbols.mjs map|codemod|check
 *
 * Map values are svg-400 rounded basenames, validated against the package files.
 */
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VUE_ROOT = path.resolve(__dirname, "..")
const REPO_ROOT = path.resolve(VUE_ROOT, "../..")
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
const MAP_OUT = path.join(VUE_ROOT, "scripts/material-symbols-map.json")
const REGISTRY_OUT = path.join(VUE_ROOT, "src/components/material-symbols.ts")
const SCAN_DIRS = [
  path.join(REPO_ROOT, "packages/registry-vue"),
  path.join(VUE_ROOT, "src"),
]
const LUCIDE_IMPORT_RE =
  /import\s*\{([^}]+)\}\s*from\s*["']lucide-vue-next["'];?/g
const PLACEHOLDER_LUCIDE_RE = /lucide="([^"]+)"/g
const IMPORT_BASE = "@material-symbols/svg-400/rounded"

const existsSvg = (base) => fs.existsSync(path.join(ROUNDED_DIR, `${base}.svg`))

const baseFromReactMap = (lucide) => {
  const withIcon = lucide.endsWith("Icon") ? lucide : `${lucide}Icon`
  return REACT_MAP[withIcon] ?? REACT_MAP[lucide] ?? null
}

// Vue-only lucide names not covered by the React map: lucide name -> svg-400 base.
const OVERRIDES = {
  ArrowUpDown: "swap_vert",
  CalendarDaysIcon: "calendar_month",
  CalendarPlusIcon: "calendar_add_on",
  Braces: "code",
  BracesIcon: "code",
  Code2Icon: "code",
  BookUser: "contacts",
  GitBranch: "account_tree",
  GitBranchIcon: "account_tree",
  DollarSign: "attach_money",
  DollarSignIcon: "attach_money",
  Paperclip: "attach_file",
  PaperclipIcon: "attach_file",
  ListFilter: "filter_list",
  ListFilterIcon: "filter_list",
  ListFilterPlusIcon: "filter_list",
  CornerDownLeft: "subdirectory_arrow_left",
  CornerDownLeftIcon: "subdirectory_arrow_left",
  Slash: "block",
  SlashIcon: "block",
  AtSign: "alternate_email",
  AtSignIcon: "alternate_email",
  Popcorn: "theaters",
  PopcornIcon: "theaters",
  SquareTerminal: "terminal",
  SquareTerminalIcon: "terminal",
  ShieldAlert: "gpp_maybe",
  ShieldAlertIcon: "gpp_maybe",
  CircleCheckBig: "check_circle",
  CircleCheckBigIcon: "check_circle",
  CircleFadingArrowUpIcon: "change_circle",
  ClockIcon: "schedule",
  Dot: "fiber_manual_record",
  Link2Icon: "link",
  MailCheckIcon: "mark_email_read",
  RefreshCcw: "refresh",
  Truck: "local_shipping",
}

const heuristicBase = (lucide) =>
  lucide
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase()

function resolveBase(lucide) {
  const base = OVERRIDES[lucide] ?? baseFromReactMap(lucide) ?? heuristicBase(lucide)
  return existsSvg(base) ? base : null
}

function eachFile(fn) {
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.name === "node_modules" || entry.name === "dist") continue
      if (entry.isDirectory()) walk(full)
      else if (/\.(vue|ts|tsx)$/.test(entry.name)) fn(full)
    }
  }
  SCAN_DIRS.forEach(walk)
}

function parseSpecifiers(inner) {
  return inner
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.split(/\s+as\s+/)
      return { imported: m[0].trim(), local: (m[1] ?? m[0]).trim() }
    })
}

function collect() {
  const importNames = new Set()
  const placeholderNames = new Set()
  eachFile((file) => {
    const content = fs.readFileSync(file, "utf-8")
    let m
    LUCIDE_IMPORT_RE.lastIndex = 0
    while ((m = LUCIDE_IMPORT_RE.exec(content)) !== null)
      for (const { imported } of parseSpecifiers(m[1])) importNames.add(imported)
    PLACEHOLDER_LUCIDE_RE.lastIndex = 0
    while ((m = PLACEHOLDER_LUCIDE_RE.exec(content)) !== null)
      placeholderNames.add(m[1])
  })
  return { importNames: [...importNames].sort(), placeholderNames: [...placeholderNames].sort() }
}

function buildMap() {
  const { importNames, placeholderNames } = collect()
  const all = [...new Set([...importNames, ...placeholderNames])].sort()
  const map = {}
  const misses = []
  for (const n of all) {
    const base = resolveBase(n)
    if (base) map[n] = base
    else misses.push(`${n} (tried "${OVERRIDES[n] ?? baseFromReactMap(n) ?? heuristicBase(n)}")`)
  }
  return { all, map, misses, placeholderNames }
}

function svgInner(base) {
  const svg = fs.readFileSync(path.join(ROUNDED_DIR, `${base}.svg`), "utf-8")
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 -960 960 960"
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim()
  return { viewBox, inner }
}

function writeRegistry(map, placeholderNames) {
  const bases = [...new Set(placeholderNames.map((n) => map[n]))].sort()
  const entries = bases
    .map((base) => {
      const { viewBox, inner } = svgInner(base)
      const body = inner.replace(/"/g, '\\"')
      return `  "${base}": (props: Record<string, unknown>) =>\n    h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "${viewBox}", width: "1em", height: "1em", fill: "currentColor", ...props, innerHTML: "${body}" }),`
    })
    .join("\n")
  const content = `// Auto-generated by scripts/material-symbols.mjs — inlined @material-symbols/svg-400 (rounded).
/* eslint-disable */
import { h, type Component } from "vue"

export const materialSymbols: Record<string, Component> = {
${entries}
}
`
  fs.writeFileSync(REGISTRY_OUT, content)
}

function cmdMap({ write = true } = {}) {
  const { all, map, misses, placeholderNames } = buildMap()
  console.log(
    `vue names: ${all.length} | mapped: ${Object.keys(map).length} | MISS: ${misses.length}`
  )
  if (misses.length) {
    console.log("\n⚠ Unmapped (add to OVERRIDES):")
    misses.forEach((m) => console.log(`  - ${m}`))
    return false
  }
  if (write) {
    fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2) + "\n")
    writeRegistry(map, placeholderNames)
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
  let imports = 0
  let placeholders = 0

  eachFile((file) => {
    let content = fs.readFileSync(file, "utf-8")
    const before = content
    content = content.replace(LUCIDE_IMPORT_RE, (_w, inner) => {
      imports++
      return parseSpecifiers(inner)
        .map(({ imported, local }) => `import ${local} from "${IMPORT_BASE}/${map[imported]}.svg?component"`)
        .join("\n")
    })
    content = content.replace(PLACEHOLDER_LUCIDE_RE, (whole, name, offset, str) => {
      const head = str.slice(offset).split(/\/?>/)[0]
      if (/materialSymbols=/.test(head)) return whole
      placeholders++
      return `${whole}\n      materialSymbols="${map[name]}"`
    })
    if (content !== before && !check) fs.writeFileSync(file, content)
  })

  if (check) {
    let leftover = 0
    eachFile((file) => {
      if (/from\s*["']lucide-vue-next["']/.test(fs.readFileSync(file, "utf-8"))) leftover++
    })
    if (leftover) {
      console.error(`${leftover} file(s) still import lucide-vue-next.`)
      process.exit(1)
    }
    console.log("✓ No lucide-vue-next imports remain.")
    return
  }
  console.log(`✓ Rewrote ${imports} import block(s) + injected ${placeholders} placeholder prop(s).`)
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
