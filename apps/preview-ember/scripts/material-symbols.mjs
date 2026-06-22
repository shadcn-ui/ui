#!/usr/bin/env node
/**
 * Ember Material Symbols tooling. Rewrites `~icons/lucide/<name>` imports to
 * `~icons/material-symbols/<name>-(outline-)rounded` (rounded, unfilled), driven
 * by a validated lucide(kebab) -> iconify-name map.
 *
 *   node scripts/material-symbols.mjs map      # build + report the map
 *   node scripts/material-symbols.mjs codemod  # rewrite imports
 *   node scripts/material-symbols.mjs check     # CI guard (no writes)
 *
 * Map source of truth: the React registry map (apps/v4/registry/icons/
 * material-symbols-map.json) plus the kebab/override tables below.
 */
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EMBER_ROOT = path.resolve(__dirname, "..")
const REPO_ROOT = path.resolve(EMBER_ROOT, "../..")
const REACT_MAP = JSON.parse(
  fs.readFileSync(
    path.join(REPO_ROOT, "apps/v4/registry/icons/material-symbols-map.json"),
    "utf-8"
  )
)
const MAP_OUT = path.join(EMBER_ROOT, "scripts/material-symbols-map.json")
const SCAN_DIRS = [
  path.join(REPO_ROOT, "packages/registry-ember"),
  path.join(EMBER_ROOT, "src"),
]

// Load the iconify material-symbols icon set for validation.
const iconifyDir = execSync(
  `find ${REPO_ROOT}/node_modules/.pnpm -maxdepth 4 -type d -path "*@iconify-json+material-symbols*/material-symbols"`
)
  .toString()
  .trim()
  .split("\n")[0]
const ICONIFY = JSON.parse(
  fs.readFileSync(path.join(iconifyDir, "icons.json"), "utf-8")
).icons
const hasIconify = (n) => n in ICONIFY

// React map keys are lucide PascalCase ("ChevronDownIcon"); ember imports use
// kebab ("chevron-down"). Build a kebab -> svg-400 basename lookup from it.
const kebabToBase = {}
for (const [pascal, base] of Object.entries(REACT_MAP)) {
  const kebab = pascal
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
  kebabToBase[kebab] = base
}

// Ember-only icons not covered by the React map (kebab -> svg-400 basename).
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
  globe: "language",
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

// Pick the rounded-unfilled iconify name. Preference order keeps icons unfilled:
//   -outline-rounded (rounded, unfilled) -> -rounded (no fill variant exists) ->
//   plain (outlined unfilled, when the set ships no rounded form).
function iconifyName(base) {
  const dashed = base.replace(/_/g, "-")
  for (const c of [`${dashed}-outline-rounded`, `${dashed}-rounded`, dashed]) {
    if (hasIconify(c)) return c
  }
  return null
}

function distinctEmberNames() {
  const names = new Set()
  const re = /~icons\/lucide\/([a-z0-9-]+)/g
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.name === "node_modules" || entry.name === "dist") continue
      if (entry.isDirectory()) walk(full)
      else {
        const content = fs.readFileSync(full, "utf-8")
        let m
        while ((m = re.exec(content)) !== null) names.add(m[1])
      }
    }
  }
  SCAN_DIRS.forEach(walk)
  return [...names].sort()
}

function buildMap() {
  const names = distinctEmberNames()
  const map = {}
  const misses = []
  for (const kebab of names) {
    const base = OVERRIDES[kebab] ?? kebabToBase[kebab] ?? kebab.replace(/-/g, "_")
    const ms = iconifyName(base)
    if (ms) map[kebab] = ms
    else misses.push(`${kebab} (base "${base}")`)
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

function cmdCodemod({ check = false } = {}) {
  const { map, misses } = buildMap()
  if (misses.length) {
    console.error("Map incomplete; run `map` and fix OVERRIDES first.")
    process.exit(1)
  }
  let changed = 0
  const remaining = []
  eachFile((file) => {
    const before = fs.readFileSync(file, "utf-8")
    const after = before.replace(
      /(~icons\/)lucide(\/)([a-z0-9-]+)/g,
      (whole, p1, sep, name) => {
        const ms = map[name]
        return ms ? `${p1}material-symbols${sep}${ms}` : whole
      }
    )
    if (after !== before) {
      changed++
      if (check) remaining.push(path.relative(REPO_ROOT, file))
      else fs.writeFileSync(file, after)
    }
  })
  if (check) {
    if (remaining.length) {
      console.error(`${remaining.length} file(s) still import ~icons/lucide:`)
      remaining.forEach((f) => console.error(`  - ${f}`))
      process.exit(1)
    }
    console.log("✓ No ~icons/lucide imports remain.")
    return
  }
  console.log(`✓ Rewrote lucide -> material-symbols imports in ${changed} file(s).`)
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
