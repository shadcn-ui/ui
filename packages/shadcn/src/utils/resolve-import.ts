import { getPatternWildcardValue } from "@/src/utils/import-matcher"
import {
  resolvePackageImport,
  type ImportEmitMode,
} from "@/src/utils/package-imports"
import { resolveWorkspacePackageExport } from "@/src/utils/workspace"
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
) {
  const cwd = config.cwd ?? config.absoluteBaseUrl

  if (importPath.startsWith("#")) {
    const resolved = resolvePackageImport(importPath, cwd)

    if (resolved) {
      return {
        path: resolved.path,
        source: "package_imports",
        matchedAlias: resolved.matchedAlias,
        matchedTarget: resolved.matchedTarget,
        emitMode: resolved.emitMode,
      } satisfies ResolvedImport
    }
  }

  const workspaceResolved = await resolveWorkspacePackageExport(importPath, cwd)

  if (workspaceResolved) {
    return {
      path: workspaceResolved.path,
      source: "workspace_package_exports",
      matchedAlias: workspaceResolved.matchedAlias,
      matchedTarget: workspaceResolved.matchedTarget,
      emitMode: workspaceResolved.emitMode,
    } satisfies ResolvedImport
  }

  return resolveFromTsconfigPaths(importPath, config)
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

function resolveFromTsconfigPaths(
  importPath: string,
  config: ResolveImportConfig
) {
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

function findMatchingTsPathPattern(
  importPath: string,
  paths: ConfigLoaderSuccessResult["paths"]
) {
  for (const [key, targets] of Object.entries(paths)) {
    const targetList = Array.isArray(targets) ? targets : [targets]
    const wildcardValue = getPatternWildcardValue(importPath, key)

    if (wildcardValue === null) {
      continue
    }

    return {
      key,
      target:
        targetList[0]?.includes("*") && wildcardValue !== null
          ? targetList[0].replace(/\*/g, wildcardValue)
          : targetList[0],
    }
  }

  return null
}
