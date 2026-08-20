import { existsSync } from "fs"
import { join } from "path"
import { logger } from "@/src/utils/logger"

export async function loadEnvFiles(
  cwd: string = process.cwd(),
  options: {
    processEnv?: NodeJS.ProcessEnv
  } = {}
): Promise<NodeJS.ProcessEnv> {
  const processEnv = options.processEnv ?? process.env

  try {
    const { config } = await import("@dotenvx/dotenvx")
    const envFiles = [
      ".env.local",
      ".env.development.local",
      ".env.development",
      ".env",
    ]

    for (const envFile of envFiles) {
      const envPath = join(cwd, envFile)
      if (existsSync(envPath)) {
        config({
          path: envPath,
          overload: false,
          quiet: true,
          processEnv: processEnv as Record<string, string>,
        })
      }
    }
  } catch (error) {
    logger.warn("Failed to load env files:", error)
  }

  return processEnv
}
