export function isContentSame(
  existingContent: string,
  newContent: string,
  options: {
    ignoreImports?: boolean
  } = {}
) {
  const { ignoreImports = false } = options

  const normalizedExisting = existingContent.replace(/\r\n/g, "\n").trim()
  const normalizedNew = newContent.replace(/\r\n/g, "\n").trim()

  if (normalizedExisting === normalizedNew) {
    return true
  }

  if (!ignoreImports) {
    return false
  }

  // Matches import patterns including:
  // - import defaultExport from "module"
  // - import * as name from "module"
  // - import { export1, export2 } from "module"
  // - import { export1 as alias1 } from "module"
  // - import defaultExport, { export1 } from "module"
  // - import type { Type } from "module"
  const importRegex =
    /^(import\s+(?:type\s+)?(?:\*\s+as\s+\w+|\{[^}]*\}|\w+)?(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+["'])([^"']+)(["'])/gm

  // Collapses alias differences so `@/components/ui/button` and
  // `@workspace/ui/components/button` compare equal. Relative imports are kept.
  const normalizeImports = (content: string) => {
    return content.replace(
      importRegex,
      (_match, prefix, importPath, suffix) => {
        if (importPath.startsWith(".")) {
          return `${prefix}${importPath}${suffix}`
        }

        const parts = importPath.split("/")
        const lastPart = parts[parts.length - 1]

        return `${prefix}@normalized/${lastPart}${suffix}`
      }
    )
  }

  const existingNormalized = normalizeImports(normalizedExisting)
  const newNormalized = normalizeImports(normalizedNew)

  return existingNormalized === newNormalized
}
