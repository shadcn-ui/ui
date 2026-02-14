import type { RegistryItem } from "@/src/registry/schema"

export interface TemplateOptions {
  projectPath: string
  packageManager: string
  cwd: string
  srcDir: boolean
  version: string
}

export function createTemplate(config: {
  name: string
  title: string
  defaultProjectName: string
  init: (options: TemplateOptions) => Promise<void>
  create: (options: TemplateOptions) => Promise<void>
  files?: RegistryItem["files"]
}) {
  return config
}

export const GITHUB_TEMPLATE_URL =
  "https://codeload.github.com/shadcn-ui/ui/tar.gz/main"
