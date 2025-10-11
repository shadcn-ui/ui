import { logger } from "@/src/utils/logger"
import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths"

const FN = "resolvePathWithOptions"

const createPathResolver = (config: ConfigLoaderSuccessResult) => {
  return createMatchPath(config.absoluteBaseUrl, config.paths)
}

const resolvePathWithOptions = (
  config: ConfigLoaderSuccessResult,
  importPath: string,
  extensions: string[] = [".ts", ".tsx", ".jsx", ".js", ".css"],
  fileExists?: (name: string) => boolean
): string | undefined => {
  try {
    //
    const matchPath = createPathResolver(config)
    return matchPath(importPath, undefined, fileExists, extensions)
  } catch (error) {
    logger.error(
      `${FN}: Error matching path ${importPath}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
    return undefined
  }
}

export { resolvePathWithOptions }
