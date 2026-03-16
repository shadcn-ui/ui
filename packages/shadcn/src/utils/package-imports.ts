import path from "path"
import { getPackageInfo } from "@/src/utils/get-package-info"

export type ImportEmitMode = "strip_extension" | "preserve_extension"

export type PackageImportEntry = {
  key: string
  aliasBase: string
  target: string
  emitMode: ImportEmitMode
  hasWildcard: boolean
}

export type PackageImportMatch = {
  path: string
  matchedAlias: string
  matchedTarget: string
  emitMode: ImportEmitMode
}

const packageImportEntriesCache = new Map<string, PackageImportEntry[]>()

export function getPackageImportEntries(cwd: string): PackageImportEntry[] {
  const cacheKey = path.resolve(cwd)
  const cachedEntries = packageImportEntriesCache.get(cacheKey)

  if (cachedEntries) {
    return cachedEntries
  }

  const packageInfo = getPackageInfo(cwd, false)
  const imports = packageInfo?.imports

  if (!imports || typeof imports !== "object" || Array.isArray(imports)) {
    packageImportEntriesCache.set(cacheKey, [])
    return []
  }

  const entries: PackageImportEntry[] = []

  for (const [key, value] of Object.entries(imports)) {
    if (!key.startsWith("#")) {
      continue
    }

    const target = resolveLocalImportTarget(value)
    if (!target) {
      continue
    }

    entries.push({
      key,
      aliasBase: key.endsWith("/*") ? key.slice(0, -2) : key,
      target,
      emitMode: getImportEmitMode(target),
      hasWildcard: key.includes("*"),
    })
  }

  packageImportEntriesCache.set(cacheKey, entries)
  return entries
}

export function getPackageImportPrefix(cwd: string) {
  const aliases = getPackageImportEntries(cwd).map((entry) => entry.aliasBase)

  if (!aliases.length) {
    return null
  }

  return getSharedPackageImportPrefix(aliases)
}

export function resolvePackageImport(
  importPath: string,
  cwd: string
): PackageImportMatch | null {
  const entries = getPackageImportEntries(cwd)

  const exactMatch = entries.find(
    (entry) => !entry.hasWildcard && entry.key === importPath
  )
  if (exactMatch) {
    return {
      path: path.resolve(cwd, exactMatch.target),
      matchedAlias: exactMatch.key,
      matchedTarget: exactMatch.target,
      emitMode: exactMatch.emitMode,
    }
  }

  const wildcardMatches = entries
    .filter((entry) => entry.hasWildcard)
    .sort((a, b) => b.key.length - a.key.length)

  for (const entry of wildcardMatches) {
    const [keyPrefix, keySuffix] = entry.key.split("*")
    const wildcardValue = getWildcardValue(importPath, keyPrefix, keySuffix)

    if (wildcardValue === null) {
      continue
    }

    return {
      path: path.resolve(cwd, applyWildcardTarget(entry.target, wildcardValue)),
      matchedAlias: entry.key,
      matchedTarget: entry.target,
      emitMode: entry.emitMode,
    }
  }

  return null
}

export function getPackageImportAliases(cwd: string) {
  const entries = getPackageImportEntries(cwd)

  return {
    components: findBestAlias(entries, "components"),
    ui: findBestAlias(entries, "ui"),
    lib: findBestAlias(entries, "lib"),
    hooks: findBestAlias(entries, "hooks"),
    utils: findBestAlias(entries, "utils"),
  }
}

function resolveLocalImportTarget(target: unknown): string | null {
  if (typeof target === "string") {
    return target.startsWith(".") ? target : null
  }

  if (Array.isArray(target)) {
    for (const value of target) {
      const resolved = resolveLocalImportTarget(value)
      if (resolved) {
        return resolved
      }
    }

    return null
  }

  if (target && typeof target === "object") {
    for (const value of Object.values(target as Record<string, unknown>)) {
      const resolved = resolveLocalImportTarget(value)
      if (resolved) {
        return resolved
      }
    }
  }

  return null
}

function getImportEmitMode(target: string): ImportEmitMode {
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

function getWildcardValue(
  importPath: string,
  prefix: string,
  suffix: string
): string | null {
  if (importPath.startsWith(prefix) && importPath.endsWith(suffix)) {
    return suffix
      ? importPath.slice(prefix.length, -suffix.length)
      : importPath.slice(prefix.length)
  }

  // `components.json` stores alias roots like `#components`, not raw
  // `package.json#imports` patterns like `#components/*`, so we accept the
  // bare alias base here to keep package-import support schema-compatible.
  if (
    suffix === "" &&
    prefix.endsWith("/") &&
    importPath === prefix.slice(0, -1)
  ) {
    return ""
  }

  return null
}

function applyWildcardTarget(target: string, wildcardValue: string) {
  if (!target.includes("*")) {
    return target
  }

  const [prefix, suffix = ""] = target.split("*")

  if (!wildcardValue) {
    return prefix.replace(/\/$/, "")
  }

  return `${prefix}${wildcardValue}${suffix}`
}

function findBestAlias(
  entries: PackageImportEntry[],
  kind: "components" | "ui" | "lib" | "hooks" | "utils"
) {
  const matches = entries
    .map((entry) => ({
      entry,
      score: getAliasScore(entry, kind),
    }))
    .filter((match) => match.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.entry.aliasBase.length - a.entry.aliasBase.length
    )

  return matches[0]?.entry.aliasBase
}

function getAliasScore(
  entry: PackageImportEntry,
  kind: "components" | "ui" | "lib" | "hooks" | "utils"
) {
  const aliasBase = entry.aliasBase.toLowerCase()
  const normalizedTarget = normalizeTarget(entry.target).toLowerCase()

  switch (kind) {
    case "components":
      if (
        aliasBase.endsWith("/ui") ||
        normalizedTarget.includes("/components/ui")
      ) {
        return 0
      }
      if (includesPathSegment(aliasBase, "components")) return 4
      if (includesPathSegment(normalizedTarget, "components")) return 3
      return 0
    case "ui":
      if (aliasBase.endsWith("/ui") || aliasBase === "#ui") return 5
      if (normalizedTarget.includes("/components/ui")) return 4
      if (normalizedTarget.endsWith("/ui")) return 3
      return 0
    case "lib":
      if (aliasBase === "#lib" || aliasBase.endsWith("/lib")) return 5
      if (normalizedTarget.endsWith("/lib")) return 4
      if (includesPathSegment(normalizedTarget, "lib")) return 3
      return 0
    case "hooks":
      if (aliasBase === "#hooks" || aliasBase.endsWith("/hooks")) return 5
      if (normalizedTarget.endsWith("/hooks")) return 4
      if (includesPathSegment(normalizedTarget, "hooks")) return 3
      return 0
    case "utils":
      if (aliasBase === "#utils" || aliasBase.endsWith("/utils")) return 5
      if (normalizedTarget.endsWith("/lib/utils")) return 4
      if (normalizedTarget.endsWith("/utils")) return 3
      return 0
  }
}

function normalizeTarget(target: string) {
  return target
    .replace(/\/\*$/, "")
    .replace(/\*$/, "")
    .replace(/\/index\.[^/]+$/, "")
}

function includesPathSegment(value: string, segment: string) {
  return (
    value === segment ||
    value.includes(`/${segment}`) ||
    value.includes(`${segment}/`)
  )
}

function getSharedPackageImportPrefix(aliasBases: string[]) {
  const sharedSegments = aliasBases
    .map((aliasBase) => aliasBase.slice(1).split("/").filter(Boolean))
    .reduce<string[]>((shared, segments, index) => {
      if (!index) {
        return segments
      }

      return shared.filter((segment, segmentIndex) => {
        return segments[segmentIndex] === segment
      })
    }, [])

  return sharedSegments.length ? `#${sharedSegments.join("/")}` : "#"
}
