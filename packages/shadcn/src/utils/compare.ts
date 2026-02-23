export function isContentSame(
  existingContent: string,
  newContent: string,
  options: {
    ignoreImports?: boolean
  } = {}
) {
  const { ignoreImports = false } = options

  // Normalize line endings and whitespace.
  const normalizedExisting = existingContent.replace(/\r\n/g, "\n").trim()
  const normalizedNew = newContent.replace(/\r\n/g, "\n").trim()

  // First, try exact match after normalization.
  if (normalizedExisting === normalizedNew) {
    return true
  }

  // If not ignoring imports or exact match failed, return false
  if (!ignoreImports) {
    return false
  }

  // Compare with import statements normalized.
  // This regex matches various import patterns including:
  // - import defaultExport from "module"
  // - import * as name from "module"
  // - import { export1, export2 } from "module"
  // - import { export1 as alias1 } from "module"
  // - import defaultExport, { export1 } from "module"
  // - import type { Type } from "module"
  // - This Regex written by Claude Code.
  const importRegex =
    /^(import\s+(?:type\s+)?(?:\*\s+as\s+\w+|\{[^}]*\}|\w+)?(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+["'])([^"']+)(["'])/gm

  // Function to normalize import paths - remove alias differences.
  const normalizeImports = (content: string) => {
    return content.replace(
      importRegex,
      (_match, prefix, importPath, suffix) => {
        // Keep relative imports as-is.
        if (importPath.startsWith(".")) {
          return `${prefix}${importPath}${suffix}`
        }

        // For aliased imports, normalize to a common format.
        // Extract the last meaningful part of the path.
        const parts = importPath.split("/")
        const lastPart = parts[parts.length - 1]

        // Normalize to a consistent format.
        return `${prefix}@normalized/${lastPart}${suffix}`
      }
    )
  }

  const existingNormalized = normalizeImports(normalizedExisting)
  const newNormalized = normalizeImports(normalizedNew)

  return existingNormalized === newNormalized
}
