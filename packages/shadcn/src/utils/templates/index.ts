import { next } from "./next"
import { nextMonorepo } from "./next-monorepo"
import { start } from "./start"
import { vite } from "./vite"

export { createTemplate, GITHUB_TEMPLATE_URL } from "./create-template"
export type { TemplateOptions } from "./create-template"

export const templates = {
  next,
  "next-monorepo": nextMonorepo,
  vite,
  start,
} as const
