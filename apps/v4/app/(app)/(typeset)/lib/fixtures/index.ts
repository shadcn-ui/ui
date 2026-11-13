import { ARTICLE_HTML } from "./article"
import { CHANGELOG_HTML } from "./changelog"
import { CHAT_HTML } from "./chat"
import { DOCS_HTML } from "./docs"
import { KITCHEN_SINK_HTML } from "./elements"
import { NOTES_HTML } from "./notes"
import { RECIPE_HTML } from "./recipe"
import { TAILWIND_HTML } from "./tailwind"

export const FIXTURES = {
  docs: DOCS_HTML,
  chat: CHAT_HTML,
  article: ARTICLE_HTML,
  changelog: CHANGELOG_HTML,
  notes: NOTES_HTML,
  recipe: RECIPE_HTML,
  elements: KITCHEN_SINK_HTML,
  tailwind: TAILWIND_HTML,
} as const

export const CONTENT_OPTIONS = [
  { value: "docs", label: "Docs" },
  { value: "chat", label: "Chat" },
  { value: "article", label: "Article" },
  { value: "changelog", label: "Changelog" },
  { value: "notes", label: "Notes" },
  // { value: "recipe", label: "Recipe" },
  // { value: "elements", label: "Elements" },
] as const

// Testing baselines, dev-only: never built or offered in production.
export const DEV_CONTENT_OPTIONS: readonly {
  value: keyof typeof FIXTURES
  label: string
}[] = [
  // { value: "tailwind", label: "Tailwind" },
]

export const AVAILABLE_CONTENT_OPTIONS =
  process.env.NODE_ENV === "development"
    ? ([...CONTENT_OPTIONS, ...DEV_CONTENT_OPTIONS] as const)
    : CONTENT_OPTIONS
