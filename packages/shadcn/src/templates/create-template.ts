import type { RegistryItem } from "@/src/registry/schema"
import type { Config } from "@/src/utils/get-config"
import { execa } from "execa"

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
  silent: boolean
}

export function createTemplate(config: {
  name: string
  title: string
  defaultProjectName: string
  // Force a specific package manager for this template.
  packageManager?: string
  // Framework names that map to this template.
  frameworks?: string[]
  scaffold: (options: TemplateOptions) => Promise<void>
  create: (options: TemplateOptions) => Promise<void>
  init?: (options: TemplateInitOptions) => Promise<Config>
  files?: RegistryItem["files"]
  postInit?: (options: { projectPath: string }) => Promise<void>
}) {
  return {
    ...config,
    frameworks: config.frameworks ?? [],
    postInit: config.postInit ?? defaultPostInit,
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

export const GITHUB_TEMPLATE_URL =
  "https://codeload.github.com/shadcn-ui/ui/tar.gz/main"
