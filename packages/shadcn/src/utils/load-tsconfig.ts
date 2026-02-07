import fs from "fs"
import path from "path"
import {
  loadConfig,
  type ConfigLoaderResult,
  type ConfigLoaderSuccessResult,
} from "tsconfig-paths"

/**
 * Safely loads tsconfig.json with proper error handling for Windows.
 *
 * On Windows, the tsconfig-paths library traverses up the directory tree
 * using fs.readdirSync, which can fail with EPERM when encountering
 * protected junction points like "Application Data" or localized system
 * folders in user directories.
 *
 * This wrapper:
 * 1. First tries to find tsconfig.json/jsconfig.json directly in the cwd
 * 2. Falls back to the standard loadConfig with error handling
 * 3. Gracefully handles EPERM errors by returning a failed result
 */
export function loadTsConfig(cwd: string): ConfigLoaderResult {
  // First, try to find tsconfig.json or jsconfig.json directly in cwd
  // This avoids walking up directories in most cases
  const tsconfigPath = findTsConfigInDir(cwd)

  if (tsconfigPath) {
    // If we found a config file directly, use loadConfig with explicit path
    // This avoids the directory walking that causes EPERM errors
    try {
      return loadConfig(cwd)
    } catch (error) {
      // If loadConfig throws (e.g., EPERM during path resolution),
      // fall through to manual loading
      if (isPermissionError(error)) {
        return loadTsConfigManually(tsconfigPath)
      }
      throw error
    }
  }

  // Try standard loadConfig, but catch EPERM errors
  try {
    return loadConfig(cwd)
  } catch (error) {
    if (isPermissionError(error)) {
      // On Windows, walking up directories can hit protected folders
      // Return a failed result instead of crashing
      return {
        resultType: "failed",
        message: `Could not search for tsconfig.json due to permission error. Please ensure a tsconfig.json exists in your project root.`,
      }
    }
    throw error
  }
}

/**
 * Check if tsconfig.json or jsconfig.json exists directly in the given directory
 */
function findTsConfigInDir(dir: string): string | null {
  const candidates = ["tsconfig.json", "jsconfig.json"]

  for (const filename of candidates) {
    const filePath = path.join(dir, filename)
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return filePath
      }
    } catch {
      // Ignore errors when checking file existence
    }
  }

  return null
}

/**
 * Manually load a tsconfig.json file and extract paths configuration
 */
function loadTsConfigManually(
  configPath: string
): ConfigLoaderSuccessResult | { resultType: "failed"; message: string } {
  try {
    const content = fs.readFileSync(configPath, "utf-8")
    // Remove comments (simple approach - handles // and /* */ comments)
    const jsonContent = content
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "")

    const config = JSON.parse(jsonContent)
    const compilerOptions = config.compilerOptions || {}

    return {
      resultType: "success",
      configFileAbsolutePath: configPath,
      baseUrl: compilerOptions.baseUrl,
      absoluteBaseUrl: compilerOptions.baseUrl
        ? path.resolve(path.dirname(configPath), compilerOptions.baseUrl)
        : path.dirname(configPath),
      paths: compilerOptions.paths || {},
      addMatchAll: compilerOptions.baseUrl !== undefined,
    }
  } catch (error) {
    return {
      resultType: "failed",
      message: `Failed to parse ${configPath}: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * Check if an error is a permission error (EPERM on Windows)
 */
function isPermissionError(error: unknown): boolean {
  if (error instanceof Error) {
    const nodeError = error as NodeJS.ErrnoException
    return (
      nodeError.code === "EPERM" ||
      nodeError.code === "EACCES" ||
      error.message.includes("operation not permitted") ||
      error.message.includes("permission denied")
    )
  }
  return false
}
