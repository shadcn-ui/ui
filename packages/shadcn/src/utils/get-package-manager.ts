import { detect } from "@antfu/ni"

export async function getPackageManager(
  targetDir: string,
  { withFallback }: { withFallback?: boolean } = {
    withFallback: false,
  }
): Promise<"yarn" | "pnpm" | "bun" | "npm" | "deno"> {
  const detected = await detect({ programmatic: true, cwd: targetDir })

  let packageManager: "yarn" | "pnpm" | "bun" | "npm" | "deno" | null =
    null

  if (detected === "yarn@berry") packageManager = "yarn"
  else if (detected === "pnpm@6") packageManager = "pnpm"
  else if (
    detected === "yarn" ||
    detected === "pnpm" ||
    detected === "bun" ||
    detected === "npm" ||
    detected === "deno"
  ) {
    packageManager = detected
  }

  if (withFallback) {
    // When fallback is enabled (new project scaffolding),
    // prefer the package manager used to invoke the CLI.
    const userAgent = process.env.npm_config_user_agent || ""

    if (userAgent.startsWith("yarn")) return "yarn"
    if (userAgent.startsWith("pnpm")) return "pnpm"
    if (userAgent.startsWith("bun")) return "bun"
    if (userAgent.startsWith("npm")) return "npm"
  }

  return packageManager ?? "npm"
}

export async function getPackageRunner(cwd: string) {
  const packageManager = await getPackageManager(cwd)

  if (packageManager === "pnpm") return "pnpm dlx"

  if (packageManager === "bun") return "bunx"

  return "npx"
}
