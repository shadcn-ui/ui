// Guards the public surface of the `shadcn` package.
//
// For every entry in package.json#exports this records:
// - the runtime export names (and their kind) of the built JS entry, and
// - the type-level export names of the built .d.ts entry, resolved with the
//   TypeScript compiler under the bundler, node16 and node10 resolution modes.
//
// The result is compared against scripts/exports.snapshot.json.
// Run `node scripts/check-exports.mjs --update` to rewrite the snapshot.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const snapshotPath = path.join(root, "scripts", "exports.snapshot.json")
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8")
)

// Importing the root entry runs the CLI, so only its types are checked.
const SKIP_RUNTIME = new Set(["."])

const RESOLUTION_MODES = {
  bundler: {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  },
  node16: {
    module: ts.ModuleKind.Node16,
    moduleResolution: ts.ModuleResolutionKind.Node16,
  },
  node10: {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Node10,
  },
}

function getRuntimeKind(value) {
  if (typeof value === "function") {
    return /^class[\s{]/.test(Function.prototype.toString.call(value))
      ? "class"
      : "function"
  }
  if (value === null) {
    return "null"
  }
  return typeof value
}

async function getRuntimeExports(file) {
  const mod = await import(pathToFileURL(file).href)
  return Object.fromEntries(
    Object.keys(mod)
      .sort()
      .map((name) => [name, getRuntimeKind(mod[name])])
  )
}

function getTypeExports(file, options) {
  const program = ts.createProgram([file], {
    ...options,
    target: ts.ScriptTarget.ESNext,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  })
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(file)
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) {
    throw new Error(`Could not read the module symbol of ${file}`)
  }

  const exports = {}
  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const target =
      symbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(symbol)
        : symbol
    // An export that the compiler cannot resolve is a broken export.
    if (
      target.flags === ts.SymbolFlags.None ||
      checker.isUnknownSymbol(target)
    ) {
      exports[symbol.name] = "unresolved"
      continue
    }
    const isValue = !!(target.flags & ts.SymbolFlags.Value)
    const isType = !!(target.flags & ts.SymbolFlags.Type)
    exports[symbol.name] =
      isValue && isType ? "value+type" : isValue ? "value" : "type"
  }

  return Object.fromEntries(
    Object.entries(exports).sort(([a], [b]) => a.localeCompare(b))
  )
}

async function collect() {
  const result = {}
  const problems = []

  for (const [subpath, target] of Object.entries(packageJson.exports)) {
    if (typeof target === "string") {
      continue
    }

    const entry = {}
    if (!SKIP_RUNTIME.has(subpath)) {
      entry.runtime = await getRuntimeExports(path.join(root, target.default))
    }

    const types = {}
    for (const [mode, options] of Object.entries(RESOLUTION_MODES)) {
      types[mode] = getTypeExports(path.join(root, target.types), options)
    }
    entry.types = types.bundler
    for (const mode of Object.keys(RESOLUTION_MODES)) {
      if (JSON.stringify(types[mode]) !== JSON.stringify(types.bundler)) {
        problems.push(
          `${subpath}: type exports under "${mode}" resolution differ from "bundler".`
        )
      }
    }
    for (const [name, kind] of Object.entries(entry.types)) {
      if (kind === "unresolved") {
        problems.push(`${subpath}: type export "${name}" does not resolve.`)
      }
    }

    result[subpath] = entry
  }

  return { result, problems }
}

function diff(expected, actual) {
  const lines = []
  for (const subpath of new Set([
    ...Object.keys(expected),
    ...Object.keys(actual),
  ])) {
    for (const layer of ["runtime", "types"]) {
      const before = expected[subpath]?.[layer] ?? {}
      const after = actual[subpath]?.[layer] ?? {}
      for (const name of new Set([
        ...Object.keys(before),
        ...Object.keys(after),
      ])) {
        if (!(name in after)) {
          lines.push(`- ${subpath} ${layer} ${name} (${before[name]})`)
        } else if (!(name in before)) {
          lines.push(`+ ${subpath} ${layer} ${name} (${after[name]})`)
        } else if (before[name] !== after[name]) {
          lines.push(
            `~ ${subpath} ${layer} ${name} (${before[name]} -> ${after[name]})`
          )
        }
      }
    }
  }
  return lines
}

const { result, problems } = await collect()

if (process.argv.includes("--update")) {
  fs.writeFileSync(snapshotPath, `${JSON.stringify(result, null, 2)}\n`)
  console.log(`Updated ${path.relative(process.cwd(), snapshotPath)}`)
} else {
  const expected = JSON.parse(fs.readFileSync(snapshotPath, "utf8"))
  const changes = diff(expected, result)
  if (changes.length) {
    console.error("The public exports of shadcn changed:\n")
    console.error(changes.join("\n"))
    console.error(
      "\nIf this is intended, run `node scripts/check-exports.mjs --update`."
    )
    process.exitCode = 1
  } else {
    console.log("The public exports of shadcn are unchanged.")
  }
}

if (problems.length) {
  console.error(`\n${problems.join("\n")}`)
  process.exitCode = 1
}
