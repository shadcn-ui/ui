import fs from "node:fs"
import path from "node:path"
import { detect } from "@antfu/ni"

export type PackageManager = "yarn" | "pnpm" | "bun" | "npm" | "deno" | "aube"

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
  if (packageManager === "aube") return "aube"

  if (
    fs.existsSync(path.resolve(targetDir, "aube-lock.yaml")) ||
    fs.existsSync(path.resolve(targetDir, "aube-workspace.yaml"))
  ) {
    return "aube"
  }

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

  if (userAgent.startsWith("aube")) {
    return "aube"
  }

  if (userAgent.startsWith("npm")) {
    return "npm"
  }

  return null
}

export function getPackageRunnerCommand(packageManager: PackageManager | null) {
  if (packageManager === "pnpm") return "pnpm dlx"

  if (packageManager === "bun") return "bunx"

  if (packageManager === "aube") return "aube dlx"

  return "npx"
}

export async function getPackageRunner(cwd: string) {
  const packageManager = await getPackageManager(cwd)

  return getPackageRunnerCommand(packageManager)
}
