import path from "path"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fg from "fast-glob"
import fs from "fs-extra"

const FRAMEWORK_CONFIG_FILES = [
  "next.config.*",
  "vite.config.*",
  "astro.config.*",
  "remix.config.*",
  "nuxt.config.*",
  "svelte.config.*",
  "gatsby-config.*",
  "angular.json",
]

// Checks for workspace signals at the given directory.
export async function isMonorepoRoot(cwd: string) {
  // pnpm workspaces.
  if (fs.existsSync(path.resolve(cwd, "pnpm-workspace.yaml"))) {
    return true
  }

  // npm/yarn workspaces.
  const packageJsonPath = path.resolve(cwd, "package.json")
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath)
      if (packageJson.workspaces) {
        return true
      }
    } catch {
      // Ignore parse errors.
    }
  }

  // Lerna.
  if (fs.existsSync(path.resolve(cwd, "lerna.json"))) {
    return true
  }

  // Nx.
  if (fs.existsSync(path.resolve(cwd, "nx.json"))) {
    return true
  }

  return false
}

// Finds app directories in a monorepo that contain framework configs or components.json.
export async function getMonorepoTargets(cwd: string) {
  const patterns = await getWorkspacePatterns(cwd)

  if (!patterns.length) {
    return []
  }

  // Resolve patterns to directories.
  const dirs = await fg(patterns, {
    cwd,
    onlyDirectories: true,
    ignore: ["**/node_modules/**"],
  })

  const targets: { name: string; hasConfig: boolean }[] = []

  for (const dir of dirs) {
    const fullPath = path.resolve(cwd, dir)

    // Check if it has a package.json (it's an actual workspace).
    if (!fs.existsSync(path.resolve(fullPath, "package.json"))) {
      continue
    }

    const hasComponentsJson = fs.existsSync(
      path.resolve(fullPath, "components.json")
    )

    // Check for framework config files.
    const hasFrameworkConfig = FRAMEWORK_CONFIG_FILES.some((pattern) => {
      const matches = fg.sync(pattern, {
        cwd: fullPath,
        dot: true,
      })
      return matches.length > 0
    })

    if (hasComponentsJson || hasFrameworkConfig) {
      targets.push({
        name: dir,
        hasConfig: hasComponentsJson,
      })
    }
  }

  return targets
}

// Formats and logs the monorepo detection message.
export function formatMonorepoMessage(
  command: string,
  targets: { name: string; hasConfig: boolean }[],
  options?: {
    cwdFlag?: string
  }
) {
  const cwdFlag = options?.cwdFlag ?? "-c"

  logger.break()
  logger.log(
    `It looks like you are running ${highlighter.info(
      command
    )} from a monorepo root.`
  )
  logger.log(
    `To use shadcn in a specific workspace, use the ${highlighter.info(
      cwdFlag
    )} flag:`
  )
  logger.break()

  for (const target of targets) {
    logger.log(`  shadcn ${command} ${cwdFlag} ${target.name}`)
  }

  logger.break()
}

export async function getWorkspacePatterns(cwd: string) {
  const patterns: string[] = []

  // Read pnpm-workspace.yaml.
  const pnpmWorkspacePath = path.resolve(cwd, "pnpm-workspace.yaml")
  if (fs.existsSync(pnpmWorkspacePath)) {
    const content = await fs.readFile(pnpmWorkspacePath, "utf8")
    patterns.push(...parsePnpmWorkspacePackages(content))
  }

  // Read package.json workspaces.
  const packageJsonPath = path.resolve(cwd, "package.json")
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath)
      const workspaces = Array.isArray(packageJson.workspaces)
        ? packageJson.workspaces
        : packageJson.workspaces?.packages
      if (Array.isArray(workspaces)) {
        // Filter out negation patterns.
        patterns.push(...workspaces.filter((w: string) => !w.startsWith("!")))
      }
    } catch {
      // Ignore parse errors.
    }
  }

  return Array.from(new Set(patterns))
}

export function parsePnpmWorkspacePackages(content: string) {
  const patterns: string[] = []
  let inPackages = false
  let packagesIndent = 0

  for (const line of content.split("\n")) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const keyMatch = line.match(/^(\s*)([A-Za-z0-9_-]+)\s*:/)
    if (keyMatch) {
      packagesIndent = keyMatch[1].length
      inPackages = keyMatch[2] === "packages"
      continue
    }

    if (!inPackages) {
      continue
    }

    const itemMatch = line.match(/^(\s*)-\s*(.+?)\s*(?:#.*)?$/)
    if (!itemMatch || itemMatch[1].length <= packagesIndent) {
      continue
    }

    patterns.push(itemMatch[2].trim().replace(/^["']|["']$/g, ""))
  }

  return patterns
}
