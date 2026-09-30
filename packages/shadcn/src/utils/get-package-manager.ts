import { detect } from "@antfu/ni"
import fs from "fs-extra"
import path from "path"

export type PackageManager =
  | "yarn"
  | "pnpm"
  | "bun"
  | "npm"
  | "deno"
  | "nub"

export async function getPackageManager(
  targetDir: string,
  { withFallback }: { withFallback?: boolean } = {
    withFallback: false,
  }
): Promise<PackageManager> {
  const packageJsonPath = path.join(targetDir, "package.json")
  const packageJson = await fs.readJson(packageJsonPath).catch(() => null)

  if (packageJson?.packageManager?.startsWith("nub@")) {
    return "nub"
  }

  if (await fs.pathExists(path.join(targetDir, "nub.lock"))) {
    return "nub"
  }

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

  if (userAgent.startsWith("nub")) {
    return "nub"
  }

  if (userAgent.startsWith("npm")) {
    return "npm"
  }

  return null
}

export function getPackageRunnerCommand(packageManager: PackageManager | null) {
  if (packageManager === "pnpm") return "pnpm dlx"

  if (packageManager === "bun") return "bunx"

  if (packageManager === "nub") return "nubx"

  return "npx"
}

export async function getPackageRunner(cwd: string) {
  const packageManager = await getPackageManager(cwd)

  return getPackageRunnerCommand(packageManager)
}