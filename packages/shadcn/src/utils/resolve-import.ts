import { readFileSync } from "fs"
import path from "path"
import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths"

export async function resolveImport(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, "absoluteBaseUrl" | "paths">
) {
  // Handle subpath imports (#) by resolving from package.json imports field.
  if (importPath.startsWith("#")) {
    try {
      // @ts-ignore
      const resolved = import.meta.resolve(importPath, import.meta.url)
      if(resolved) return resolved;
    }
    catch {
      // If native resolution fails, fallback to manual resolution.
    }

    return resolveSubpathImport(importPath, config.absoluteBaseUrl)
  }

  return createMatchPath(config.absoluteBaseUrl, config.paths)(
    importPath,
    undefined,
    () => true,
    [".ts", ".tsx", ".jsx", ".js", ".css"]
  )
}

function resolveSubpathImport(
  importPath: string,
  baseDir: string
): string | null {
  let packageJson: { imports?: Record<string, unknown> }
  try {
    packageJson = JSON.parse(
      readFileSync(path.resolve(baseDir, "package.json"), "utf-8")
    )
  } catch {
    return null
  }

  const imports = packageJson.imports
  if (!imports || typeof imports !== "object") {
    return null
  }

  // Try exact match first.
  if (importPath in imports) {
    const resolved = resolveImportTarget(imports[importPath])
    if (resolved) {
      return path.resolve(baseDir, resolved)
    }
    return null
  }

  // Try wildcard patterns (most specific / longest pattern first).
  const patterns = Object.keys(imports)
    .filter((p) => p.includes("*"))
    .sort((a, b) => b.length - a.length)

  for (const pattern of patterns) {
    const [prefix, suffix] = pattern.split("*")
    if (
      importPath.startsWith(prefix) &&
      (suffix === "" || importPath.endsWith(suffix))
    ) {
      const wildcard = suffix
        ? importPath.slice(prefix.length, -suffix.length)
        : importPath.slice(prefix.length)
      const target = resolveImportTarget(imports[pattern])
      if (target) {
        return path.resolve(baseDir, target.replace("*", wildcard))
      }
    }
  }

  return null
}

// Resolve a conditional import target to the first local path.
function resolveImportTarget(target: unknown): string | null {
  if (typeof target === "string") {
    return target.startsWith(".") ? target : null
  }

  if (Array.isArray(target)) {
    for (const item of target) {
      const resolved = resolveImportTarget(item)
      if (resolved) return resolved
    }
    return null
  }

  if (target && typeof target === "object") {
    // Iterate conditions in order, return the first local path.
    for (const value of Object.values(target as Record<string, unknown>)) {
      const resolved = resolveImportTarget(value)
      if (resolved) return resolved
    }
    return null
  }

  return null
}
