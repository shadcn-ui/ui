import { next } from "./next"
import { nextMonorepo } from "./next-monorepo"
import { start } from "./start"
import { vite } from "./vite"

export { createTemplate, GITHUB_TEMPLATE_URL } from "./create-template"
export type { TemplateInitOptions, TemplateOptions } from "./create-template"

export const templates = {
  next,
  vite,
  start,
  "next-monorepo": nextMonorepo,
}

// Resolve a template key from a detected framework name.
export function getTemplateForFramework(frameworkName?: string) {
  if (!frameworkName) {
    return undefined
  }

  for (const [key, template] of Object.entries(templates)) {
    if (template.frameworks.includes(frameworkName)) {
      return key
    }
  }

  return undefined
}
