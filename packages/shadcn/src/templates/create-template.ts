import os from "os"
import path from "path"
import type { RegistryItem } from "@/src/registry/schema"
import type { Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fs from "fs-extra"

const GITHUB_REPO_URL =
  process.env.SHADCN_GITHUB_URL ?? "https://github.com/shadcn-ui/ui.git"

export interface TemplateOptions {
  projectPath: string
  packageManager: string
  cwd: string
}

export interface TemplateInitOptions {
  projectPath: string
  components: string[]
  registryBaseConfig?: Record<string, unknown>
  rtl: boolean
  menuColor?: string
  menuAccent?: string
  iconLibrary?: string
  silent: boolean
}

export interface TemplateConfig {
  name: string
  title: string
  description?: string
  defaultProjectName: string
  // The template directory name (e.g. "next-app", "vite-app").
  templateDir: string
  // Framework names that map to this template.
  frameworks?: string[]
  scaffold?: (options: TemplateOptions) => Promise<void>
  create: (options: TemplateOptions) => Promise<void>
  init?: (options: TemplateInitOptions) => Promise<Config>
  files?: RegistryItem["files"]
  postInit?: (options: { projectPath: string }) => Promise<void>
  // Monorepo overrides. When --monorepo is passed, these fields
  // are merged over the base template config.
  monorepo?: {
    templateDir: string
    defaultProjectName?: string
    init?: (options: TemplateInitOptions) => Promise<Config>
    files?: RegistryItem["files"]
  }
}

export function createTemplate(config: TemplateConfig) {
  return {
    ...config,
    frameworks: config.frameworks ?? [],
    scaffold:
      config.scaffold ??
      defaultScaffold({
        title: config.title,
        templateDir: config.templateDir,
      }),
    postInit: config.postInit ?? defaultPostInit,
  }
}

// Resolve effective template config for --monorepo mode.
export function resolveTemplate(
  template: ReturnType<typeof createTemplate>,
  { monorepo }: { monorepo?: boolean }
) {
  if (!monorepo || !template.monorepo) {
    return template
  }

  const m = template.monorepo
  const resolved = {
    ...template,
    templateDir: m.templateDir,
    defaultProjectName: m.defaultProjectName ?? m.templateDir,
    init: m.init ?? template.init,
    files: m.files ?? template.files,
  }

  // Rebuild scaffold with monorepo overrides.
  resolved.scaffold = defaultScaffold({
    title: template.title,
    templateDir: m.templateDir,
  })

  return resolved
}

// Get the appropriate install args for the given package manager.
function getInstallArgs(packageManager: string): string[] {
  switch (packageManager) {
    case "pnpm":
      // pnpm enables frozen lockfile in CI by default.
      // The template lockfile may drift, so force-disable it explicitly.
      return ["--no-frozen-lockfile"]
    default:
      return []
  }
}

// Adapt a pnpm-based monorepo template to the target package manager.
async function adaptWorkspaceConfig(
  projectPath: string,
  packageManager: string
) {
  if (packageManager === "pnpm") {
    return
  }

  const pnpmWorkspacePath = path.join(projectPath, "pnpm-workspace.yaml")
  const packageJsonPath = path.join(projectPath, "package.json")

  // Remove pnpm-lock.yaml.
  const lockFilePath = path.join(projectPath, "pnpm-lock.yaml")
  if (fs.existsSync(lockFilePath)) {
    await fs.remove(lockFilePath)
  }

  const isMonorepo = fs.existsSync(pnpmWorkspacePath)

  // Update root package.json: strip "packageManager" field to avoid
  // triggering Corepack, and add "workspaces" for npm/bun/yarn.
  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8")
    const packageJson = JSON.parse(packageJsonContent)
    delete packageJson.packageManager

    if (isMonorepo) {
      // Read workspace patterns from pnpm-workspace.yaml.
      const workspaceContent = await fs.readFile(pnpmWorkspacePath, "utf8")
      const patterns: string[] = []
      for (const line of workspaceContent.split("\n")) {
        const match = line.match(/^\s*-\s*["']?(.+?)["']?\s*$/)
        if (match) {
          patterns.push(match[1])
        }
      }

      packageJson.workspaces = patterns
      await fs.remove(pnpmWorkspacePath)
    }

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    )
  }

  // Rewrite workspace: protocol references in nested package.json files.
  // npm does not support workspace: protocol; bun and yarn do, so only
  // rewrite for npm monorepo templates.
  if (isMonorepo && packageManager === "npm") {
    await rewriteWorkspaceProtocol(projectPath)
  }
}

// Recursively find all package.json files and replace workspace: protocol
// version specifiers with "*", which npm understands.
async function rewriteWorkspaceProtocol(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === "node_modules") continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await rewriteWorkspaceProtocol(fullPath)
    } else if (entry.name === "package.json") {
      const content = await fs.readFile(fullPath, "utf8")
      if (!content.includes("workspace:")) continue
      const pkg = JSON.parse(content)
      let changed = false
      for (const depKey of [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
      ]) {
        const deps = pkg[depKey]
        if (!deps) continue
        for (const [name, version] of Object.entries(deps)) {
          if (typeof version === "string" && version.startsWith("workspace:")) {
            deps[name] = "*"
            changed = true
          }
        }
      }
      if (changed) {
        await fs.writeFile(fullPath, JSON.stringify(pkg, null, 2) + "\n")
      }
    }
  }
}

// Default scaffold that downloads a template from GitHub.
function defaultScaffold({
  title,
  templateDir,
}: {
  title: string
  templateDir: string
}) {
  return async ({ projectPath, packageManager }: TemplateOptions) => {
    const createSpinner = spinner(
      `Creating a new ${title} project. This may take a few minutes.`
    ).start()

    try {
      const localTemplateDir = process.env.SHADCN_TEMPLATE_DIR
      if (localTemplateDir) {
        // Use local template directory for development.
        const localTemplatePath = path.resolve(localTemplateDir, templateDir)
        await fs.copy(localTemplatePath, projectPath, {
          filter: (src) => !src.includes("node_modules"),
        })
      } else {
        // Clone only the template directory from GitHub using sparse checkout.
        const templatePath = path.join(
          os.tmpdir(),
          `shadcn-template-${Date.now()}`
        )
        await execa("git", [
          "clone",
          "--depth",
          "1",
          "--filter=blob:none",
          "--sparse",
          GITHUB_REPO_URL,
          templatePath,
        ])
        await execa("git", [
          "-C",
          templatePath,
          "sparse-checkout",
          "set",
          `templates/${templateDir}`,
        ])

        const extractedPath = path.resolve(
          templatePath,
          "templates",
          templateDir
        )
        await fs.move(extractedPath, projectPath)
        await fs.remove(templatePath)
      }

      // Adapt workspace config and lockfiles for the target package manager.
      await adaptWorkspaceConfig(projectPath, packageManager)

      // Run install.
      const installArgs = getInstallArgs(packageManager)
      const args = ["install", ...installArgs]
      await execa(packageManager, args, {
        cwd: projectPath,
      })

      // Write project name to the package.json.
      const packageJsonPath = path.join(projectPath, "package.json")
      if (fs.existsSync(packageJsonPath)) {
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8")
        const packageJson = JSON.parse(packageJsonContent)
        packageJson.name = path.basename(projectPath)
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2) + "\n"
        )
      }

      createSpinner?.succeed(`Creating a new ${title} project.`)
    } catch (error) {
      createSpinner?.fail(
        `Something went wrong creating a new ${title} project.`
      )
      handleError(error)
    }
  }
}

// Initialize a git repository and create an initial commit.
// Silently ignores failures (e.g. git not installed).
async function defaultPostInit({ projectPath }: { projectPath: string }) {
  try {
    await execa("git", ["init"], { cwd: projectPath })
    await execa("git", ["add", "-A"], { cwd: projectPath })
    await execa("git", ["commit", "-m", "feat: initial commit"], {
      cwd: projectPath,
    })
  } catch {}
}
