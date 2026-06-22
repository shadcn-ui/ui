#!/usr/bin/env node
/**
 * Ember Material Symbols tooling (source: @material-symbols/svg-400, rounded).
 * Rewrites `~icons/lucide/<kebab>` -> `~icons/ms/<svg400-base>` (unplugin-icons
 * FileSystemIconLoader; local identifier kept, template unchanged).
 *
 *   node scripts/material-symbols.mjs map|codemod|check
 */
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EMBER_ROOT = path.resolve(__dirname, "..")
const REPO_ROOT = path.resolve(EMBER_ROOT, "../..")
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
const MAP_OUT = path.join(EMBER_ROOT, "scripts/material-symbols-map.json")
const SCAN_DIRS = [
  path.join(REPO_ROOT, "packages/registry-ember"),
  path.join(EMBER_ROOT, "src"),
]
const LUCIDE_RE = /~icons\/lucide\/([a-z0-9-]+)/g

const existsSvg = (base) => fs.existsSync(path.join(ROUNDED_DIR, `${base}.svg`))
const kebabToPascal = (k) =>
  k.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")
const pascalToBase = (lucide) =>
  REACT_MAP[`${lucide}Icon`] ?? REACT_MAP[lucide] ?? null

// Ember kebab names not covered by the React map -> svg-400 base.
const OVERRIDES = {
  "panel-left": "left_panel_open",
  "panel-left-close": "left_panel_close",
  "panel-left-open": "left_panel_open",
  "more-horizontal": "more_horiz",
  "more-vertical": "more_vert",
  dot: "fiber_manual_record",
  circle: "circle",
  "grip-vertical": "drag_indicator",
  "chevrons-up-down": "unfold_more",
  "chevrons-left": "keyboard_double_arrow_left",
  "chevrons-right": "keyboard_double_arrow_right",
  x: "close",
  minus: "remove",
  plus: "add",
  check: "check",
  search: "search",
  "calendar-plus": "calendar_add_on",
  "check-circle-2": "check_circle",
  "circle-check-big": "check_circle",
  "circle-fading-arrow-up": "change_circle",
  clock: "schedule",
  cloud: "cloud",
  command: "keyboard_command_key",
  "corner-down-left": "subdirectory_arrow_left",
  "credit-card": "credit_card",
  "dollar-sign": "attach_money",
  "file-code-2": "code",
  frame: "crop_free",
  "git-branch": "account_tree",
  globe: "globe",
  "list-filter": "filter_list",
  loader: "progress_activity",
  "loader-2": "progress_activity",
  "mail-check": "mark_email_read",
  paperclip: "attach_file",
  "pie-chart": "pie_chart",
  popcorn: "theaters",
  "refresh-ccw": "refresh",
  "settings-2": "settings",
  share: "share",
  "shield-alert": "gpp_maybe",
  slash: "block",
  "square-terminal": "terminal",
  "trash-2": "delete",
  "user-2": "person",
  "at-sign": "alternate_email",
  "audio-waveform": "graphic_eq",
}

const heuristic = (kebab) => kebab.replace(/-/g, "_")

function resolveBase(kebab) {
  const base =
    OVERRIDES[kebab] ?? pascalToBase(kebabToPascal(kebab)) ?? heuristic(kebab)
  return existsSvg(base) ? base : null
}

function eachFile(fn) {
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.name === "node_modules" || entry.name === "dist") continue
      if (entry.isDirectory()) walk(full)
      else if (/\.(gts|gjs|ts|js|hbs)$/.test(entry.name)) fn(full)
    }
  }
  SCAN_DIRS.forEach(walk)
}

function distinctNames() {
  const names = new Set()
  eachFile((file) => {
    const content = fs.readFileSync(file, "utf-8")
    let m
    LUCIDE_RE.lastIndex = 0
    while ((m = LUCIDE_RE.exec(content)) !== null) names.add(m[1])
  })
  return [...names].sort()
}

function buildMap() {
  const names = distinctNames()
  const map = {}
  const misses = []
  for (const kebab of names) {
    const base = resolveBase(kebab)
    if (base) map[kebab] = base
    else misses.push(`${kebab} (tried "${OVERRIDES[kebab] ?? heuristic(kebab)}")`)
  }
  return { names, map, misses }
}

function cmdMap({ write = true } = {}) {
  const { names, map, misses } = buildMap()
  console.log(
    `ember lucide icons: ${names.length} | mapped: ${Object.keys(map).length} | MISS: ${misses.length}`
  )
  if (misses.length) {
    console.log("\n⚠ Unmapped (add to OVERRIDES):")
    misses.forEach((m) => console.log(`  - ${m}`))
    return false
  }
  if (write) {
    fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2) + "\n")
    console.log(`\n✓ Wrote ${Object.keys(map).length} entries to ${MAP_OUT}`)
  }
  return true
}

function cmdCodemod({ check = false } = {}) {
  const { map, misses } = buildMap()
  if (misses.length) {
    console.error("Map incomplete; run `map` and fix OVERRIDES first.")
    process.exit(1)
  }
  let changed = 0
  eachFile((file) => {
    const before = fs.readFileSync(file, "utf-8")
    const after = before.replace(LUCIDE_RE, (whole, kebab) =>
      map[kebab] ? `~icons/ms/${map[kebab]}` : whole
    )
    if (after !== before) {
      changed++
      if (!check) fs.writeFileSync(file, after)
    }
  })
  if (check) {
    let leftover = 0
    eachFile((file) => {
      if (/~icons\/lucide\//.test(fs.readFileSync(file, "utf-8"))) leftover++
    })
    if (leftover) {
      console.error(`${leftover} file(s) still import ~icons/lucide.`)
      process.exit(1)
    }
    console.log("✓ No ~icons/lucide imports remain.")
    return
  }
  console.log(`✓ Rewrote ~icons/lucide -> ~icons/ms in ${changed} file(s).`)
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
