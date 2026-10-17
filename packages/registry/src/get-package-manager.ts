import path from "path"
import { detect } from "@antfu/ni"
import fs from "fs-extra"

export type PackageManager = "yarn" | "pnpm" | "bun" | "npm" | "deno"

// detect() checks deno.lock before these lockfiles, so a Node project with a
// deno.lock next to its own lockfile would be detected as deno.
const NODE_LOCKFILES = {
  "pnpm-lock.yaml": "pnpm",
  "pnpm-workspace.yaml": "pnpm",
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm",
} as const

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
  if (packageManager === "deno") {
    return getPackageManagerNextToDenoLock(targetDir) ?? "deno"
  }
  if (!withFallback) {
    return packageManager ?? "npm"
  }

  // Fallback to user agent if not detected.
  return getPackageManagerFromUserAgent() ?? "npm"
}

function getPackageManagerNextToDenoLock(targetDir: string) {
  let directory = path.resolve(targetDir)

  while (!fs.existsSync(path.join(directory, "deno.lock"))) {
    const parent = path.dirname(directory)
    if (parent === directory) {
      return null
    }
    directory = parent
  }

  for (const [lockfile, packageManager] of Object.entries(NODE_LOCKFILES)) {
    if (fs.existsSync(path.join(directory, lockfile))) {
      return packageManager
    }
  }

  return null
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
