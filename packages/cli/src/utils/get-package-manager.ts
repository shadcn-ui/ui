import { promises as fs } from "fs"
import path from "path"

async function fileExists(path: string) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export async function getPackageManager(
  cwd = "."
): Promise<"yarn" | "pnpm" | "npm"> {
  // match based on lockfile
  const [yarnLock, npmLock, pnpmLock] = await Promise.all([
    fileExists(path.resolve(cwd, "yarn.lock")),
    fileExists(path.resolve(cwd, "package-lock.json")),
    fileExists(path.resolve(cwd, "pnpm-lock.yaml")),
  ])

  if (yarnLock) {
    return "yarn"
  }

  if (pnpmLock) {
    return "pnpm"
  }

  if (npmLock) {
    return "npm"
  }

  // match based on used package manager
  const userAgent = process.env.npm_config_user_agent

  if (!userAgent) {
    return "npm"
  }

  if (userAgent.startsWith("yarn")) {
    return "yarn"
  }

  if (userAgent.startsWith("pnpm")) {
    return "pnpm"
  }

  return "npm"
}
