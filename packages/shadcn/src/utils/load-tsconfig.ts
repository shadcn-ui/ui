import path from "path"
import fs from "fs-extra"
import {
  loadConfig,
  type ConfigLoaderSuccessResult,
  type ConfigLoaderResult,
} from "tsconfig-paths"

const ALTERNATIVE_TSCONFIG_FILES = [
  "tsconfig.app.json",
  "tsconfig.web.json",
]

/**
 * Load tsconfig with fallback support for project references.
 *
 * When the root tsconfig.json uses project references (via the "references"
 * field) or has no paths defined, the standard `loadConfig` from
 * tsconfig-paths returns empty paths. This function falls back to loading
 * alternative tsconfig files (tsconfig.app.json, tsconfig.web.json) or
 * referenced tsconfig files to find the paths.
 */
export function loadTsConfigWithFallback(cwd: string): ConfigLoaderResult {
  const result = loadConfig(cwd)

  if (result.resultType === "failed") {
    return tryAlternativeConfigs(cwd) ?? result
  }

  // If paths were found, return immediately.
  if (result.paths && Object.keys(result.paths).length > 0) {
    return result
  }

  // No paths found - try alternative tsconfig files.
  return tryAlternativeConfigs(cwd) ?? result
}

function tryAlternativeConfigs(
  cwd: string
): ConfigLoaderSuccessResult | null {
  // First, check if the root tsconfig has project references.
  const rootTsConfigPath = path.resolve(cwd, "tsconfig.json")
  if (fs.existsSync(rootTsConfigPath)) {
    try {
      const parsed = parseTsConfigFile(rootTsConfigPath)

      if (Array.isArray(parsed?.references)) {
        for (const ref of parsed.references) {
          if (!ref.path) continue

          let refPath = path.resolve(cwd, ref.path)
          // If the reference points to a directory, look for tsconfig.json inside it.
          if (
            fs.existsSync(refPath) &&
            fs.statSync(refPath).isDirectory()
          ) {
            refPath = path.join(refPath, "tsconfig.json")
          }

          const result = tryLoadFromFile(cwd, refPath)
          if (result) return result
        }
      }
    } catch {
      // Ignore parse errors on root tsconfig.
    }
  }

  // Try well-known alternative tsconfig filenames.
  for (const filename of ALTERNATIVE_TSCONFIG_FILES) {
    const filePath = path.resolve(cwd, filename)
    const result = tryLoadFromFile(cwd, filePath)
    if (result) return result
  }

  return null
}

function tryLoadFromFile(
  cwd: string,
  filePath: string
): ConfigLoaderSuccessResult | null {
  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const tsconfig = readTsconfig(filePath)

    if (!tsconfig?.compilerOptions?.paths) {
      return null
    }

    if (Object.keys(tsconfig.compilerOptions.paths).length === 0) {
      return null
    }

    const baseUrl = tsconfig.compilerOptions.baseUrl ?? "."
    const absoluteBaseUrl = path.isAbsolute(baseUrl)
      ? baseUrl
      : path.resolve(path.dirname(filePath), baseUrl)

    return {
      resultType: "success",
      configFileAbsolutePath: filePath,
      baseUrl,
      absoluteBaseUrl,
      paths: tsconfig.compilerOptions.paths,
      addMatchAll: baseUrl !== undefined,
    }
  } catch {
    return null
  }
}

interface TsConfigCompilerOptions {
  baseUrl?: string
  paths?: Record<string, string[]>
}

interface TsConfig {
  extends?: string | string[]
  compilerOptions?: TsConfigCompilerOptions
  references?: Array<{ path: string }>
}

/**
 * Read and parse a tsconfig file, following "extends" chains.
 */
function readTsconfig(configFilePath: string): TsConfig | undefined {
  if (!fs.existsSync(configFilePath)) {
    return undefined
  }

  const config = parseTsConfigFile(configFilePath)
  if (!config) return undefined

  if (config.extends) {
    const extendsList = Array.isArray(config.extends)
      ? config.extends
      : [config.extends]

    let base: TsConfig = {}
    for (const ext of extendsList) {
      const resolved = resolveExtends(configFilePath, ext)
      if (resolved) {
        const extConfig = readTsconfig(resolved) ?? {}
        // Adjust baseUrl from extended config to be relative to the current config
        if (extConfig.compilerOptions?.baseUrl) {
          const extendsDir = path.relative(
            path.dirname(configFilePath),
            path.dirname(resolved)
          )
          extConfig.compilerOptions.baseUrl = extendsDir
            ? path.join(extendsDir, extConfig.compilerOptions.baseUrl)
            : extConfig.compilerOptions.baseUrl
        }
        base = mergeTsconfigs(base, extConfig)
      }
    }

    return mergeTsconfigs(base, config)
  }

  return config
}

/**
 * Parse a tsconfig JSON file, stripping comments and BOM.
 */
function parseTsConfigFile(filePath: string): TsConfig | undefined {
  try {
    const contents = fs.readFileSync(filePath, "utf8")
    // Strip BOM
    const stripped = contents.charCodeAt(0) === 0xfeff
      ? contents.slice(1)
      : contents
    // Strip single-line and multi-line comments
    const cleaned = stripped
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
    return JSON.parse(cleaned)
  } catch {
    return undefined
  }
}

function resolveExtends(
  configFilePath: string,
  extendedValue: string
): string | undefined {
  if (typeof extendedValue !== "string") return undefined

  // Add .json extension if missing
  if (!extendedValue.endsWith(".json")) {
    extendedValue += ".json"
  }

  const currentDir = path.dirname(configFilePath)
  let resolved = path.join(currentDir, extendedValue)

  // If the path contains a slash, has a dot, and doesn't exist, try node_modules
  if (
    extendedValue.includes("/") &&
    extendedValue.includes(".") &&
    !fs.existsSync(resolved)
  ) {
    resolved = path.join(currentDir, "node_modules", extendedValue)
  }

  return fs.existsSync(resolved) ? resolved : undefined
}

function mergeTsconfigs(base: TsConfig, config: TsConfig): TsConfig {
  return {
    ...base,
    ...config,
    compilerOptions: {
      ...base.compilerOptions,
      ...config.compilerOptions,
    },
  }
}
