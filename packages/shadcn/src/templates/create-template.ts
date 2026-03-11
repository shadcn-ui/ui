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
  // Force a specific package manager for this template.
  packageManager?: string
  // Framework names that map to this template.
  frameworks?: string[]
  // Custom args passed to `packageManager install`.
  installArgs?: string[]
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
    packageManager?: string
    installArgs?: string[]
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
        installArgs: config.installArgs,
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
    packageManager: m.packageManager ?? template.packageManager,
    installArgs: m.installArgs ?? template.installArgs,
    init: m.init ?? template.init,
    files: m.files ?? template.files,
  }

  // Rebuild scaffold with monorepo overrides.
  resolved.scaffold = defaultScaffold({
    title: template.title,
    templateDir: m.templateDir,
    installArgs: resolved.installArgs,
  })

  return resolved
}

// Default scaffold that downloads a template from GitHub.
function defaultScaffold({
  title,
  templateDir,
  installArgs,
}: {
  title: string
  templateDir: string
  installArgs?: string[]
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

      // Remove pnpm-lock.yaml if using a different package manager.
      if (packageManager !== "pnpm") {
        const lockFilePath = path.join(projectPath, "pnpm-lock.yaml")
        if (fs.existsSync(lockFilePath)) {
          await fs.remove(lockFilePath)
        }
      }

      // Run install.
      const args = ["install", ...(installArgs ?? [])]
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
          JSON.stringify(packageJson, null, 2)
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
