import {
  resolvePackageImport,
  type ImportEmitMode,
} from "@/src/utils/package-imports"
import { resolveWorkspacePackageExport } from "@/src/utils/workspace-package-exports"
import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths"

export type ResolvedImport = {
  path: string
  source: "tsconfig_paths" | "package_imports" | "workspace_package_exports"
  matchedAlias: string
  matchedTarget: string
  emitMode: ImportEmitMode
}

type ResolveImportConfig = Pick<
  ConfigLoaderSuccessResult,
  "absoluteBaseUrl" | "paths"
> & {
  cwd?: string
}

export async function resolveImportWithMetadata(
  importPath: string,
  config: ResolveImportConfig
): Promise<ResolvedImport | null> {
  const cwd = config.cwd ?? config.absoluteBaseUrl

  if (importPath.startsWith("#")) {
    const packageImport = resolvePackageImport(importPath, cwd)

    if (packageImport) {
      return {
        path: packageImport.path,
        source: "package_imports",
        matchedAlias: packageImport.matchedAlias,
        matchedTarget: packageImport.matchedTarget,
        emitMode: packageImport.emitMode,
      }
    }
  }

  const workspacePackageExport = await resolveWorkspacePackageExport(
    importPath,
    cwd
  )

  if (workspacePackageExport) {
    return {
      path: workspacePackageExport.path,
      source: "workspace_package_exports",
      matchedAlias: workspacePackageExport.matchedAlias,
      matchedTarget: workspacePackageExport.matchedTarget,
      emitMode: workspacePackageExport.emitMode,
    }
  }

  const matchedPath = createMatchPath(config.absoluteBaseUrl, config.paths)(
    importPath,
    undefined,
    () => true,
    [".ts", ".tsx", ".jsx", ".js", ".css"]
  )

  if (!matchedPath) {
    return null
  }

  const matchedPattern = findMatchingTsPathPattern(importPath, config.paths)

  if (!matchedPattern && isScopedPackageSpecifier(importPath)) {
    return null
  }

  return {
    path: matchedPath,
    source: "tsconfig_paths",
    matchedAlias: matchedPattern?.key ?? importPath,
    matchedTarget: matchedPattern?.target ?? matchedPath,
    emitMode: "strip_extension",
  }
}

export async function resolveImport(
  importPath: string,
  config: ResolveImportConfig
) {
  return (await resolveImportWithMetadata(importPath, config))?.path ?? null
}

export function isLocalAliasImport(
  moduleSpecifier: string,
  aliasPrefix: string | null
) {
  // Workspace package exports such as `@workspace/ui/...` are already the final
  // import specifiers we want to keep, so they are intentionally excluded here.
  if (moduleSpecifier.startsWith("#")) {
    return true
  }

  if (!aliasPrefix) {
    return false
  }

  return moduleSpecifier.startsWith(`${aliasPrefix}/`)
}

function isScopedPackageSpecifier(importPath: string) {
  return /^@[^/]+\/[^/]+(?:\/.*)?$/.test(importPath)
}

function findMatchingTsPathPattern(
  importPath: string,
  paths: ConfigLoaderSuccessResult["paths"]
) {
  for (const [key, targets] of Object.entries(paths)) {
    const targetList = Array.isArray(targets) ? targets : [targets]
    const wildcardValue = getWildcardValue(importPath, key)

    if (wildcardValue === null) {
      continue
    }

    return {
      key,
      target:
        targetList[0]?.includes("*") && wildcardValue !== null
          ? targetList[0].replace("*", wildcardValue)
          : targetList[0],
    }
  }

  return null
}

function getWildcardValue(importPath: string, pattern: string) {
  if (!pattern.includes("*")) {
    return importPath === pattern ? "" : null
  }

  const [prefix, suffix = ""] = pattern.split("*")
  if (!importPath.startsWith(prefix) || !importPath.endsWith(suffix)) {
    return null
  }

  return suffix
    ? importPath.slice(prefix.length, -suffix.length)
    : importPath.slice(prefix.length)
}
