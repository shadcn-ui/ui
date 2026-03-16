import path from "path"
import { getWorkspacePatterns } from "@/src/utils/get-monorepo-info"
import { getPackageInfo } from "@/src/utils/get-package-info"
import fg from "fast-glob"
import fs from "fs-extra"
import {
  getImportTargetEmitMode,
  resolveImportEntryMatch,
  resolveLocalPathTarget,
  type ImportEmitMode,
  type ImportResolutionEntry,
  type ImportResolutionMatch,
} from "@/src/utils/import-matcher"

type WorkspacePackageInfo = {
  packageName: string
  packageRoot: string
}

type WorkspacePackageExportEntry = ImportResolutionEntry
export type WorkspacePackageExportMatch = ImportResolutionMatch

const workspacePackageCache = new Map<
  string,
  Map<string, WorkspacePackageInfo>
>()
const workspaceExportEntriesCache = new Map<
  string,
  WorkspacePackageExportEntry[]
>()
const workspaceRootCache = new Map<string, string | null>()

export async function resolveWorkspacePackageExport(
  importPath: string,
  cwd: string
) {
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

  return resolveImportEntryMatch(
    importPath,
    getWorkspacePackageExportEntries(workspacePackage)
  )
}

function getWorkspacePackageExportEntries(
  workspacePackage: WorkspacePackageInfo
) {
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

    const target = resolveLocalPathTarget(value)

    if (!target) {
      continue
    }

    const aliasBase = getAliasBase(workspacePackage.packageName, key)

    entries.push({
      key: key.includes("*") ? `${aliasBase}/*` : aliasBase,
      aliasBase,
      target,
      emitMode: getImportTargetEmitMode(target),
      hasWildcard: key.includes("*"),
      rootDir: workspacePackage.packageRoot,
    })
  }

  workspaceExportEntriesCache.set(cacheKey, entries)
  return entries
}

async function findWorkspacePackage(
  cwd: string,
  packageName: string
) {
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
  const start = path.resolve(cwd)
  const cachedRoot = workspaceRootCache.get(start)

  if (cachedRoot !== undefined) {
    return cachedRoot
  }

  let current = start
  const gitRoot = await findGitRoot(start)

  while (true) {
    const patterns = await getWorkspacePatterns(current)

    if (patterns.length) {
      workspaceRootCache.set(start, current)
      return current
    }

    if (gitRoot && current === gitRoot) {
      workspaceRootCache.set(start, null)
      return null
    }

    const parent = path.dirname(current)

    if (parent === current) {
      workspaceRootCache.set(start, null)
      return null
    }

    current = parent
  }
}

async function findGitRoot(cwd: string) {
  let current = path.resolve(cwd)

  while (true) {
    if (fs.existsSync(path.resolve(current, ".git"))) {
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
