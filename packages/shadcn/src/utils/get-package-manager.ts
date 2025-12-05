import { detect } from "@antfu/ni"

export type PackageManager =
  | "yarn"
  | "yarn@berry"
  | "pnpm"
  | "bun"
  | "npm"
  | "deno"

export async function getPackageManager(
  targetDir: string,
  { withFallback }: { withFallback?: boolean } = {
    withFallback: false,
  }
): Promise<PackageManager> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir })

  if (packageManager === "yarn@berry") return "yarn@berry"
  if (packageManager === "pnpm@6") return "pnpm"
  if (packageManager === "bun") return "bun"
  if (packageManager === "deno") return "deno"
  if (!withFallback) {
    return packageManager ?? "npm"
  }

  // Fallback to user agent if not detected.
  const userAgent = process.env.npm_config_user_agent || ""

  if (userAgent.startsWith("yarn")) {
    return "yarn"
  }

  if (userAgent.startsWith("pnpm")) {
    return "pnpm"
  }

  if (userAgent.startsWith("bun")) {
    return "bun"
  }

  return "npm"
}

export function getPackageExecutor(packageManager: PackageManager) {
  if (packageManager === "yarn@berry")
    return ["yarn", ["dlx"], ["--yarn"]] as const

  if (packageManager === "pnpm") return ["pnpm", ["dlx"], ["--pnpm"]] as const

  if (packageManager === "bun") return ["bunx", [], ["--bun"]] as const

  return ["npx", [], []] as const
}

export async function getPackageRunner(cwd: string) {
  const packageManager = await getPackageManager(cwd)

  if (packageManager === "yarn") return "yarn dlx"

  if (packageManager === "pnpm") return "pnpm dlx"

  return packageManager
}

export async function getPackageManagerExecutable(
  cwd: string,
  options: { withFallback?: boolean } = {
    withFallback: false,
  }
) {
  const packageManager = await getPackageManager(cwd, options)

  if (packageManager === "yarn@berry") return "yarn"

  return packageManager
}
