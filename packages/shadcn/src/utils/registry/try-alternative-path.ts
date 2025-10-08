import { stat } from "fs/promises"
import path from "path"
import { configSchema } from "@/src/schema"
import { logger } from "@/src/utils/logger"
import { resolvePathWithOptions } from "@/src/utils/registry/resolve-path-with-options"
import { loadConfig } from "tsconfig-paths"
import z from "zod"

const FN = "tryAlternativePath"

type ResolvedPath = {
  absolute: string
  relative: string
}

const tryAlternativePath = async (
  filePath: string,
  config: z.infer<typeof configSchema>
): Promise<ResolvedPath | null> => {
  //

  try {
    const tsConfig = await loadConfig(config.resolvedPaths.cwd)
    if (tsConfig.resultType === "failed") {
      logger.warn(`${FN}: tsConfig load failed: ${config.resolvedPaths.cwd}`)
      return null
    }

    const absolutePath = resolvePathWithOptions(tsConfig, filePath)
    if (!absolutePath) {
      logger.warn(`${FN}: Unable to resolve import path: ${filePath}`)
      return null
    }

    const stats = await stat(absolutePath)
    if (!stats.isFile()) {
      logger.warn(`${FN}: Path is not a file: ${absolutePath}`)
      return null
    }

    const baseDir = path.resolve(tsConfig.absoluteBaseUrl)
    const relativePath = path.relative(baseDir, absolutePath)

    return { absolute: absolutePath, relative: relativePath }
    //
  } catch (error) {
    //

    logger.error(
      `${FN}: Error processing path ${filePath}: ${
        error instanceof Error ? error.message : `Unknown error ${error}`
      }`
    )

    return null
  }
}

export { tryAlternativePath }
