import { existsSync } from "fs"
import { join } from "path"
import { logger } from "@/src/utils/logger"

export async function loadEnvFiles(cwd: string = process.cwd()): Promise<void> {
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
        })
      }
    }
  } catch (error) {
    logger.warn("Failed to load env files:", error)
  }
}
