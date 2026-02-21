import { logger } from "@/src/utils/logger"
import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths"

const FN = "resolvePathWithOptions"

type Config = Pick<ConfigLoaderSuccessResult, "absoluteBaseUrl" | "paths"> &
  Partial<ConfigLoaderSuccessResult>

const createPathResolver = (config: Config) => {
  return createMatchPath(config.absoluteBaseUrl, config.paths)
}

const resolvePathWithOptions = (
  importPath: string,
  config: Config,
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
