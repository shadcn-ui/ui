#!/usr/bin/env node
// Lists installed UI components that no file in the showcase imports.
// Usage: node showcase-coverage.mjs <ui-dir> <showcase-dir...>
import { readdirSync, readFileSync, statSync } from "node:fs"
import { basename, extname, join, resolve } from "node:path"

const [uiArg, ...roots] = process.argv.slice(2)

if (!uiArg || roots.length === 0) {
  console.error("Usage: node showcase-coverage.mjs <ui-dir> <showcase-dir...>")
  process.exit(1)
}

const uiDir = resolve(uiArg)

const components = readdirSync(uiDir)
  .filter((file) => [".tsx", ".ts"].includes(extname(file)))
  .map((file) => basename(file, extname(file)))

function walk(path) {
  if (statSync(path).isFile()) {
    return [path]
  }

  return readdirSync(path).flatMap((entry) => {
    const child = join(path, entry)
    // Skip the ui directory so components don't count as using each other.
    if (entry === "node_modules" || child === uiDir) {
      return []
    }
    return walk(child)
  })
}

const source = roots
  .map((root) => resolve(root))
  .flatMap(walk)
  .filter((file) => /\.(tsx?|jsx?)$/.test(file))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n")

const missing = components.filter(
  (name) => !new RegExp(`/ui/${name}["']`).test(source)
)

console.log(
  `${components.length - missing.length}/${components.length} components shown.`
)

if (missing.length > 0) {
  console.log(`Missing: ${missing.join(", ")}`)
  process.exit(1)
}
