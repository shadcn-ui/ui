/**
 * Force UI token parser
 *
 * Reads DTCG token files from tokens/ and writes resolved TypeScript
 * constants to src/generated/tokens.ts.
 *
 * Usage: pnpm parse-tokens
 *
 * Source files (tokens/):
 *   primitives.tokens.json      raw palette values
 *   semantic-light.tokens.json  semantic roles, light theme
 *   semantic-dark.tokens.json   semantic overrides, dark theme
 *
 * Output (src/generated/tokens.ts):
 *   primitives  nested palette object (color, font, spacing, …)
 *   light       flat map of resolved light-theme semantic tokens
 *   dark        flat map — light tokens with dark overrides applied
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dir = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dir, "..")

// ---------------------------------------------------------------------------
// Load source JSON files
// ---------------------------------------------------------------------------

function loadJson(filePath: string): Record<string, any> {
  return JSON.parse(readFileSync(filePath, "utf8"))
}

const primitivesRaw = loadJson(resolve(pkgRoot, "tokens/primitives.tokens.json"))
const lightRaw = loadJson(resolve(pkgRoot, "tokens/semantic-light.tokens.json"))
const darkRaw = loadJson(resolve(pkgRoot, "tokens/semantic-dark.tokens.json"))

// ---------------------------------------------------------------------------
// Build a flat primitive lookup: "color.neutral.0" -> "#ffffff"
//
// Walks the DTCG nested structure and collects every leaf that has a $value,
// keyed by its dot-separated path (metadata keys starting with $ are skipped).
// ---------------------------------------------------------------------------

function buildFlatLookup(
  obj: Record<string, any>,
  prefix = "",
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue
    const path = prefix ? `${prefix}.${key}` : key

    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      if ("$value" in val) {
        result[path] = val.$value
      } else {
        Object.assign(result, buildFlatLookup(val, path))
      }
    }
  }

  return result
}

const primitiveLookup = buildFlatLookup(primitivesRaw)

// ---------------------------------------------------------------------------
// Reference resolver
//
// Resolves "{color.neutral.0}" style references against a lookup table.
// Handles arrays (font stacks, shadow layers) and nested objects recursively.
// Throws if a reference cannot be resolved.
// ---------------------------------------------------------------------------

const REF_RE = /^\{(.+)\}$/

function resolveRef(value: any, lookup: Record<string, any>, depth = 0): any {
  if (depth > 20) {
    throw new Error(`Token resolution depth exceeded: ${JSON.stringify(value)}`)
  }

  if (typeof value === "string") {
    const match = value.match(REF_RE)
    if (match) {
      const path = match[1]
      if (!(path in lookup)) {
        throw new Error(`Unresolved token reference: {${path}}`)
      }
      return resolveRef(lookup[path], lookup, depth + 1)
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "object" && item !== null
        ? resolveObject(item, lookup, depth + 1)
        : resolveRef(item, lookup, depth + 1),
    )
  }

  return value
}

function resolveObject(
  obj: Record<string, any>,
  lookup: Record<string, any>,
  depth = 0,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, resolveRef(v, lookup, depth)]),
  )
}

// ---------------------------------------------------------------------------
// Flatten semantic tokens
//
// Walks the DTCG structure and builds a flat map keyed by dot-path.
// Values are resolved against the provided lookup; unresolvable references
// are kept as-is (raw "{...}" strings) so a second pass can handle them.
// ---------------------------------------------------------------------------

function flattenSemantic(
  obj: Record<string, any>,
  lookup: Record<string, any>,
  prefix = "",
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue
    const path = prefix ? `${prefix}.${key}` : key

    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      if ("$value" in val) {
        try {
          result[path] = resolveRef(val.$value, lookup)
        } catch {
          // Keep unresolved — may reference another semantic token.
          // The second pass will handle these.
          result[path] = val.$value
        }
      } else {
        Object.assign(result, flattenSemantic(val, lookup, path))
      }
    }
  }

  return result
}

// ---------------------------------------------------------------------------
// Resolve a semantic token set in two passes
//
// Pass 1: resolve against primitives.
// Pass 2: resolve any remaining "{...}" references using the pass-1 results
//         as an extended lookup (handles semantic-to-semantic references,
//         e.g. the focus-ring shadow referencing color.bg.surface).
// ---------------------------------------------------------------------------

function resolveSemanticTokens(
  raw: Record<string, any>,
  primitives: Record<string, any>,
): Record<string, any> {
  const pass1 = flattenSemantic(raw, primitives)
  const extended = { ...primitives, ...pass1 }

  const pass2: Record<string, any> = {}

  for (const [key, val] of Object.entries(pass1)) {
    if (typeof val === "string" && REF_RE.test(val)) {
      pass2[key] = resolveRef(val, extended)
    } else if (Array.isArray(val)) {
      // Re-resolve array items (shadow layers may contain semantic refs)
      pass2[key] = val.map((item) => {
        if (typeof item === "object" && item !== null) {
          return resolveObject(item, extended)
        }
        return typeof item === "string" && REF_RE.test(item)
          ? resolveRef(item, extended)
          : item
      })
    } else {
      pass2[key] = val
    }
  }

  return pass2
}

// ---------------------------------------------------------------------------
// Build themes
// ---------------------------------------------------------------------------

const lightTokens = resolveSemanticTokens(lightRaw, primitiveLookup)

// Dark tokens are a partial overlay — start from light then apply overrides.
// We resolve dark overrides against an extended lookup that includes both
// primitives and already-resolved light tokens so semantic cross-refs work.
const darkPartial = flattenSemantic(darkRaw, { ...primitiveLookup, ...lightTokens })

const darkExtended = { ...primitiveLookup, ...lightTokens, ...darkPartial }

const darkTokens: Record<string, any> = { ...lightTokens }

for (const [key, val] of Object.entries(darkPartial)) {
  if (typeof val === "string" && REF_RE.test(val)) {
    darkTokens[key] = resolveRef(val, darkExtended)
  } else if (Array.isArray(val)) {
    darkTokens[key] = val.map((item) => {
      if (typeof item === "object" && item !== null) {
        return resolveObject(item, darkExtended)
      }
      return typeof item === "string" && REF_RE.test(item)
        ? resolveRef(item, darkExtended)
        : item
    })
  } else {
    darkTokens[key] = val
  }
}

// ---------------------------------------------------------------------------
// Build nested primitives output (strip DTCG $ metadata, keep values)
// ---------------------------------------------------------------------------

function buildNestedOutput(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue

    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      if ("$value" in val) {
        result[key] = val.$value
      } else {
        result[key] = buildNestedOutput(val)
      }
    }
  }

  return result
}

const primitivesOutput = buildNestedOutput(primitivesRaw)

// ---------------------------------------------------------------------------
// Write output file
// ---------------------------------------------------------------------------

const banner = `// Auto-generated — do not edit manually.
// Run: pnpm parse-tokens
// Source: https://github.com/Perforce-Shared-Services/pd-the-force-design-spec
`

const outDir = resolve(pkgRoot, "src/generated")
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const output = [
  banner,
  `export const primitives = ${JSON.stringify(primitivesOutput, null, 2)} as const`,
  "",
  `export const light = ${JSON.stringify(lightTokens, null, 2)} as const`,
  "",
  `export const dark = ${JSON.stringify(darkTokens, null, 2)} as const`,
  "",
].join("\n")

writeFileSync(resolve(outDir, "tokens.ts"), output)

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const primitiveCount = Object.keys(primitiveLookup).length
const lightCount = Object.keys(lightTokens).length
const darkOverrideCount = Object.keys(darkPartial).length

console.log("✓  src/generated/tokens.ts written")
console.log(`   primitives  ${primitiveCount} tokens`)
console.log(`   light       ${lightCount} tokens`)
console.log(`   dark        ${lightCount} tokens (${darkOverrideCount} overrides from light)`)
