import path from "path"

export type ImportEmitMode = "strip_extension" | "preserve_extension"

export type ImportResolutionEntry = {
  key: string
  aliasBase: string
  target: string
  emitMode: ImportEmitMode
  hasWildcard: boolean
  rootDir: string
}

export type ImportResolutionMatch = {
  path: string
  matchedAlias: string
  matchedTarget: string
  emitMode: ImportEmitMode
}

export function resolveLocalPathTarget(target: unknown): string | null {
  if (typeof target === "string") {
    return target.startsWith(".") ? target : null
  }

  if (Array.isArray(target)) {
    for (const value of target) {
      const resolved = resolveLocalPathTarget(value)
      if (resolved) {
        return resolved
      }
    }

    return null
  }

  if (target && typeof target === "object") {
    for (const value of Object.values(target as Record<string, unknown>)) {
      const resolved = resolveLocalPathTarget(value)
      if (resolved) {
        return resolved
      }
    }
  }

  return null
}

export function getImportTargetEmitMode(target: string): ImportEmitMode {
  if (!target.includes("*")) {
    return "strip_extension"
  }

  const suffix = target.slice(target.indexOf("*") + 1)

  // A bare `*` target like `./src/components/*` expects the emitted specifier
  // to include the source extension (`#components/button.tsx`).
  if (!suffix) {
    return "preserve_extension"
  }

  return /^\.[^/]+$/.test(suffix) ? "strip_extension" : "preserve_extension"
}

export function resolveImportEntryMatch(
  importPath: string,
  entries: ImportResolutionEntry[]
): ImportResolutionMatch | null {
  const exactMatch = entries.find(
    (entry) => !entry.hasWildcard && entry.key === importPath
  )

  if (exactMatch) {
    return {
      path: path.resolve(exactMatch.rootDir, exactMatch.target),
      matchedAlias: exactMatch.key,
      matchedTarget: exactMatch.target,
      emitMode: exactMatch.emitMode,
    }
  }

  const wildcardMatches = entries
    .filter((entry) => entry.hasWildcard)
    .sort((a, b) => b.key.length - a.key.length)

  for (const entry of wildcardMatches) {
    const wildcardValue = getPatternWildcardValue(importPath, entry.key, {
      allowBareAliasBase: true,
    })

    if (wildcardValue === null) {
      continue
    }

    return {
      path: path.resolve(
        entry.rootDir,
        applyWildcardTarget(entry.target, wildcardValue)
      ),
      matchedAlias: entry.key,
      matchedTarget: entry.target,
      emitMode: entry.emitMode,
    }
  }

  return null
}

export function getPatternWildcardValue(
  importPath: string,
  pattern: string,
  options: {
    allowBareAliasBase?: boolean
  } = {}
): string | null {
  if (!pattern.includes("*")) {
    return importPath === pattern ? "" : null
  }

  const [prefix, suffix = ""] = pattern.split("*")

  if (importPath.startsWith(prefix) && importPath.endsWith(suffix)) {
    return suffix
      ? importPath.slice(prefix.length, -suffix.length)
      : importPath.slice(prefix.length)
  }

  if (
    options.allowBareAliasBase &&
    suffix === "" &&
    prefix.endsWith("/") &&
    importPath === prefix.slice(0, -1)
  ) {
    return ""
  }

  return null
}

export function applyWildcardTarget(target: string, wildcardValue: string) {
  if (!target.includes("*")) {
    return target
  }

  const [prefix, suffix = ""] = target.split("*")

  if (!wildcardValue) {
    return prefix.replace(/\/$/, "")
  }

  return `${prefix}${wildcardValue}${suffix}`
}
