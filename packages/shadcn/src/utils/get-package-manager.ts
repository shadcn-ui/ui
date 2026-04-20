import { detect } from "@antfu/ni"

function normalizePackageManager(packageManager?: string | null) {
  if (!packageManager) {
    return null
  }

  if (packageManager.startsWith("yarn")) return "yarn"
  if (packageManager.startsWith("pnpm")) return "pnpm"
  if (packageManager.startsWith("bun")) return "bun"
  if (packageManager.startsWith("deno")) return "deno"
  if (packageManager.startsWith("npm")) return "npm"

  return null
}

export async function getPackageManager(
  targetDir: string,
  { withFallback }: { withFallback?: boolean } = {
    withFallback: false,
  }
): Promise<"yarn" | "pnpm" | "bun" | "npm" | "deno"> {
  const packageManager = normalizePackageManager(
    await detect({ programmatic: true, cwd: targetDir })
  )

  if (packageManager) {
    return packageManager
  }

  if (!withFallback) {
    return "npm"
  }

  // Fallback to user agent if not detected.
  return normalizePackageManager(process.env.npm_config_user_agent) ?? "npm"
}

export async function getPackageRunner(cwd: string) {
  const packageManager = await getPackageManager(cwd)

  if (packageManager === "pnpm") return "pnpm dlx"

  if (packageManager === "bun") return "bunx"

  return "npx"
}
