import fs from "fs"
import path from "path"
import { detect } from "@antfu/ni"

export type PackageManager = "yarn" | "pnpm" | "bun" | "npm" | "deno"

/**
 * Rush (https://rushjs.io) monorepos manage dependencies through the `rush`
 * CLI. Running `npm install` / `pnpm add` directly inside a Rush project fails
 * (#5705), regardless of which package manager Rush is configured to use, so
 * installs and removals must go through `rush add` / `rush remove` instead.
 *
 * Returns the directory holding `rush.json`, or null when `cwd` is not inside a
 * Rush monorepo.
 */
export function getRushRoot(cwd: string) {
  let dir = path.resolve(cwd)

  while (true) {
    if (fs.existsSync(path.join(dir, "rush.json"))) {
      return dir
    }

    const parent = path.dirname(dir)
    if (parent === dir) {
      return null
    }
    dir = parent
  }
}

export async function getPackageManager(
  targetDir: string,
  { withFallback }: { withFallback?: boolean } = {
    withFallback: false,
  }
): Promise<PackageManager> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir })

  if (packageManager === "yarn@berry") return "yarn"
  if (packageManager === "pnpm@6") return "pnpm"
  if (packageManager === "bun") return "bun"
  if (packageManager === "deno") return "deno"
  if (!withFallback) {
    return packageManager ?? "npm"
  }

  // Fallback to user agent if not detected.
  return getPackageManagerFromUserAgent() ?? "npm"
}

export function getPackageManagerFromUserAgent(
  userAgent = process.env.npm_config_user_agent || ""
): PackageManager | null {
  if (userAgent.startsWith("yarn")) {
    return "yarn"
  }

  if (userAgent.startsWith("pnpm")) {
    return "pnpm"
  }

  if (userAgent.startsWith("bun")) {
    return "bun"
  }

  if (userAgent.startsWith("deno")) {
    return "deno"
  }

  if (userAgent.startsWith("npm")) {
    return "npm"
  }

  return null
}

export function getPackageRunnerCommand(packageManager: PackageManager | null) {
  if (packageManager === "pnpm") return "pnpm dlx"

  if (packageManager === "bun") return "bunx"

  return "npx"
}

export async function getPackageRunner(cwd: string) {
  const packageManager = await getPackageManager(cwd)

  return getPackageRunnerCommand(packageManager)
}
