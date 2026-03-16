import path from "path"
import { getWorkspacePatterns } from "@/src/utils/get-monorepo-info"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { type ImportEmitMode } from "@/src/utils/package-imports"
import fg from "fast-glob"

type WorkspacePackageInfo = {
  packageName: string
  packageRoot: string
}

type WorkspacePackageExportEntry = {
  key: string
  aliasBase: string
  target: string
  emitMode: ImportEmitMode
  hasWildcard: boolean
  packageRoot: string
}

export type WorkspacePackageExportMatch = {
  path: string
  matchedAlias: string
  matchedTarget: string
  emitMode: ImportEmitMode
}

const workspacePackageCache = new Map<
  string,
  Map<string, WorkspacePackageInfo>
>()
const workspaceExportEntriesCache = new Map<
  string,
  WorkspacePackageExportEntry[]
>()

export async function resolveWorkspacePackageExport(
  importPath: string,
  cwd: string
): Promise<WorkspacePackageExportMatch | null> {
  const specifier = parsePackageSpecifier(importPath)

  if (!specifier) {
    return null
  }

  const workspacePackage = await findWorkspacePackage(
    cwd,
    specifier.packageName
  )

  if (!workspacePackage) {
    return null
  }

  const entries = getWorkspacePackageExportEntries(workspacePackage)

  const exactMatch = entries.find(
    (entry) => !entry.hasWildcard && entry.aliasBase === importPath
  )

  if (exactMatch) {
    return {
      path: path.resolve(exactMatch.packageRoot, exactMatch.target),
      matchedAlias: exactMatch.aliasBase,
      matchedTarget: exactMatch.target,
      emitMode: exactMatch.emitMode,
    }
  }

  const wildcardMatches = entries
    .filter((entry) => entry.hasWildcard)
    .sort((a, b) => b.aliasBase.length - a.aliasBase.length)

  for (const entry of wildcardMatches) {
    const pattern = `${entry.aliasBase}/*`
    const [prefix, suffix = ""] = pattern.split("*")
    const wildcardValue = getWildcardValue(importPath, prefix, suffix)

    if (wildcardValue === null) {
      continue
    }

    return {
      path: path.resolve(
        entry.packageRoot,
        applyWildcardTarget(entry.target, wildcardValue)
      ),
      matchedAlias: pattern,
      matchedTarget: entry.target,
      emitMode: entry.emitMode,
    }
  }

  return null
}

function getWorkspacePackageExportEntries(
  workspacePackage: WorkspacePackageInfo
): WorkspacePackageExportEntry[] {
  const cacheKey = `${workspacePackage.packageRoot}:${workspacePackage.packageName}`
  const cachedEntries = workspaceExportEntriesCache.get(cacheKey)

  if (cachedEntries) {
    return cachedEntries
  }

  const packageInfo = getPackageInfo(workspacePackage.packageRoot, false)
  const exportsField = packageInfo?.exports

  if (
    !exportsField ||
    typeof exportsField !== "object" ||
    Array.isArray(exportsField)
  ) {
    workspaceExportEntriesCache.set(cacheKey, [])
    return []
  }

  const entries: WorkspacePackageExportEntry[] = []

  for (const [key, value] of Object.entries(exportsField)) {
    if (key !== "." && !key.startsWith("./")) {
      continue
    }

    const target = resolveLocalExportTarget(value)

    if (!target) {
      continue
    }

    entries.push({
      key,
      aliasBase: getAliasBase(workspacePackage.packageName, key),
      target,
      emitMode: getExportEmitMode(target),
      hasWildcard: key.includes("*"),
      packageRoot: workspacePackage.packageRoot,
    })
  }

  workspaceExportEntriesCache.set(cacheKey, entries)
  return entries
}

async function findWorkspacePackage(
  cwd: string,
  packageName: string
): Promise<WorkspacePackageInfo | null> {
  const workspaceRoot = await findWorkspaceRoot(cwd)

  if (!workspaceRoot) {
    return null
  }

  const cachedPackages = workspacePackageCache.get(workspaceRoot)

  if (cachedPackages?.has(packageName)) {
    return cachedPackages.get(packageName) ?? null
  }

  const workspacePackages = await loadWorkspacePackages(workspaceRoot)
  workspacePackageCache.set(workspaceRoot, workspacePackages)

  return workspacePackages.get(packageName) ?? null
}

async function loadWorkspacePackages(root: string) {
  const patterns = await getWorkspacePatterns(root)
  const packageMap = new Map<string, WorkspacePackageInfo>()

  if (!patterns.length) {
    return packageMap
  }

  const packageJsonPaths = await fg(
    patterns.map((pattern) =>
      path.posix.join(pattern.split(path.sep).join("/"), "package.json")
    ),
    {
      cwd: root,
      ignore: ["**/node_modules/**"],
    }
  )

  for (const packageJsonPath of packageJsonPaths) {
    const packageRoot = path.resolve(root, path.dirname(packageJsonPath))
    const packageInfo = getPackageInfo(packageRoot, false)
    const name = packageInfo?.name

    if (!name) {
      continue
    }

    packageMap.set(name, {
      packageName: name,
      packageRoot,
    })
  }

  return packageMap
}

async function findWorkspaceRoot(cwd: string) {
  let current = path.resolve(cwd)

  while (true) {
    const patterns = await getWorkspacePatterns(current)

    if (patterns.length) {
      return current
    }

    const parent = path.dirname(current)

    if (parent === current) {
      return null
    }

    current = parent
  }
}

function parsePackageSpecifier(importPath: string) {
  if (
    importPath.startsWith("#") ||
    importPath.startsWith(".") ||
    path.isAbsolute(importPath)
  ) {
    return null
  }

  const segments = importPath.split("/")

  if (importPath.startsWith("@")) {
    if (segments.length < 2) {
      return null
    }

    return {
      packageName: `${segments[0]}/${segments[1]}`,
    }
  }

  return {
    packageName: segments[0],
  }
}

function getAliasBase(packageName: string, exportKey: string) {
  if (exportKey === ".") {
    return packageName
  }

  const normalizedKey = exportKey.slice(2).replace(/\/\*$/, "")

  return normalizedKey ? `${packageName}/${normalizedKey}` : packageName
}

function resolveLocalExportTarget(target: unknown): string | null {
  if (typeof target === "string") {
    return target.startsWith(".") ? target : null
  }

  if (Array.isArray(target)) {
    for (const value of target) {
      const resolved = resolveLocalExportTarget(value)

      if (resolved) {
        return resolved
      }
    }

    return null
  }

  if (target && typeof target === "object") {
    for (const value of Object.values(target as Record<string, unknown>)) {
      const resolved = resolveLocalExportTarget(value)

      if (resolved) {
        return resolved
      }
    }
  }

  return null
}

function getExportEmitMode(target: string): ImportEmitMode {
  if (!target.includes("*")) {
    return "strip_extension"
  }

  const suffix = target.slice(target.indexOf("*") + 1)

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
