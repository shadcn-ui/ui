import path from "path"
import {
  createMatchPath,
  loadConfig as loadTsConfigPaths,
  type ConfigLoaderResult,
  type ConfigLoaderSuccessResult,
} from "tsconfig-paths"

export async function resolveImport(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, "absoluteBaseUrl" | "paths">
) {
  return createMatchPath(config.absoluteBaseUrl, config.paths)(
    importPath,
    undefined,
    () => true,
    [".ts", ".tsx", ".jsx", ".js", ".css"]
  )
}

/**
 * Wrapper around `tsconfig-paths#loadConfig` that substitutes TypeScript's
 * `${configDir}` template variable in `baseUrl` and `paths` with the directory
 * of the resolved tsconfig file.
 *
 * TypeScript 5.5 introduced `${configDir}` for path mapping in extendable
 * tsconfigs (common in monorepos). `tsconfig-paths` (v4) does not substitute
 * this token, so without this wrapper paths like `"${configDir}/src/*"` are
 * passed through literally and the CLI ends up writing components to a folder
 * literally named `${configDir}`.
 *
 * See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#the-configdir-template-variable-for-configuration-files
 */
export function loadTsConfig(cwd?: string): ConfigLoaderResult {
  const result = loadTsConfigPaths(cwd)
  return substituteConfigDir(result)
}

export function substituteConfigDir(
  result: ConfigLoaderResult
): ConfigLoaderResult {
  if (result.resultType !== "success") {
    return result
  }

  if (!containsConfigDir(result.baseUrl) && !pathsContainConfigDir(result.paths)) {
    return result
  }

  const configDir = path.dirname(result.configFileAbsolutePath)

  const substitutedBaseUrl = result.baseUrl
    ? replaceConfigDir(result.baseUrl, configDir)
    : result.baseUrl

  const substitutedPaths = Object.fromEntries(
    Object.entries(result.paths).map(([alias, values]) => [
      alias,
      values.map((value) => replaceConfigDir(value, configDir)),
    ])
  )

  // Recompute absoluteBaseUrl when baseUrl contained `${configDir}`, otherwise
  // `tsconfig-paths` has already produced a correct value.
  const absoluteBaseUrl =
    result.baseUrl && containsConfigDir(result.baseUrl) && substitutedBaseUrl
      ? path.resolve(configDir, substitutedBaseUrl)
      : result.absoluteBaseUrl

  return {
    ...result,
    baseUrl: substitutedBaseUrl,
    absoluteBaseUrl,
    paths: substitutedPaths,
  }
}

function containsConfigDir(value: string | undefined): boolean {
  return typeof value === "string" && value.includes("${configDir}")
}

function pathsContainConfigDir(paths: Record<string, string[]>): boolean {
  for (const values of Object.values(paths)) {
    for (const value of values) {
      if (containsConfigDir(value)) return true
    }
  }
  return false
}

function replaceConfigDir(value: string, configDir: string): string {
  return value.replace(/\$\{configDir\}/g, configDir)
}
