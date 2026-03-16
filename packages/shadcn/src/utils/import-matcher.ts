import path from "path"

// Node can resolve `package.json#imports` and `package.json#exports` at
// runtime, but the CLI needs the matched pattern, local filesystem target, and
// emit behavior as data so it can place files and rewrite imports consistently.
// This module is the shared matcher for those normalized entry shapes.

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

export function resolveLocalPathTarget(target: unknown) {
  const queue = [target]

  while (queue.length) {
    const value = queue.shift()

    if (typeof value === "string") {
      if (value.startsWith(".")) {
        return value
      }

      continue
    }

    if (Array.isArray(value)) {
      queue.unshift(...value)
      continue
    }

    if (value && typeof value === "object") {
      queue.unshift(...Object.values(value as Record<string, unknown>))
    }
  }

  return null
}

export function getImportTargetEmitMode(target: string) {
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
) {
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
) {
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
