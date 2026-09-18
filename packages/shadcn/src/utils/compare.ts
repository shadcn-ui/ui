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
  const importFromRegex =
    /^(import\s+(?:type\s+)?(?:\*\s+as\s+\w+|\{[^}]*\}|\w+)?(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+["'])([^"']+)(["'])/gm
  const importSideEffectRegex = /^(import\s+["'])([^"']+)(["'])/gm

  const normalizeImportPath = (importPath: string) => {
    if (importPath.startsWith(".")) {
      return importPath
    }

    // For aliased imports, normalize to the module's terminal segment.
    const parts = importPath.split("/")
    const lastPart = parts[parts.length - 1]
    return `@normalized/${lastPart}`
  }

  // Function to normalize import paths - remove alias differences.
  const normalizeImports = (content: string) => {
    return content
      .replace(importFromRegex, (_match, prefix, importPath, suffix) => {
        return `${prefix}${normalizeImportPath(importPath)}${suffix}`
      })
      .replace(importSideEffectRegex, (_match, prefix, importPath, suffix) => {
        return `${prefix}${normalizeImportPath(importPath)}${suffix}`
      })
  }

  const existingNormalized = normalizeImports(normalizedExisting)
  const newNormalized = normalizeImports(normalizedNew)

  return existingNormalized === newNormalized
}
