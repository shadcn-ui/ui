import { createHash } from "crypto"
import { LRUCache } from "lru-cache"
import type { Element as HastElement } from "hast"
import {
  type CodeToHastOptions,
  createHighlighter,
  type Highlighter,
  type LanguageRegistration,
  type ShikiTransformer,
} from "shiki"

import rescriptTmLanguage from "@/grammars/rescript.tmLanguage.json"

// LRU cache for cross-request caching of highlighted code.
// Shiki highlighting is CPU-intensive and deterministic, so caching is safe.
const highlightCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour.
})

const rescriptLanguage: LanguageRegistration = {
  ...(rescriptTmLanguage as LanguageRegistration),
  name: "rescript",
  displayName: "ReScript",
  aliases: ["rescript", "res"],
  embeddedLangs: ["javascript"],
}

type HighlightOptions = CodeToHastOptions<string, string>

const highlighterThemeNames = ["github-dark", "github-light"] as const

const codeThemes: Record<string, string> = {
  dark: "github-dark",
  light: "github-light",
}

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...highlighterThemeNames],
      langs: [
        "tsx",
        "typescript",
        "ts",
        "jsx",
        "javascript",
        "js",
        "css",
        "json",
        "bash",
        "html",
        "mdx",
        "text",
        rescriptLanguage,
      ],
    })
  }

  return highlighterPromise
}

function normalizeLanguage(language: string) {
  const normalized = language.toLowerCase()
  if (normalized === "res" || normalized === "rescript") {
    return "rescript"
  }
  return language
}

export const transformers = [
  {
    code(node) {
      if (node.tagName === "code") {
        const raw = this.source
        node.properties["__raw__"] = raw

        if (raw.startsWith("npm install")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm install", "yarn add")
          node.properties["__pnpm__"] = raw.replace("npm install", "pnpm add")
          node.properties["__bun__"] = raw.replace("npm install", "bun add")
        }

        if (raw.startsWith("npx create-")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace(
            "npx create-",
            "yarn create "
          )
          node.properties["__pnpm__"] = raw.replace(
            "npx create-",
            "pnpm create "
          )
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        }

        // npm create.
        if (raw.startsWith("npm create")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm create", "yarn create")
          node.properties["__pnpm__"] = raw.replace("npm create", "pnpm create")
          node.properties["__bun__"] = raw.replace("npm create", "bun create")
        }

        // npx.
        if (raw.startsWith("npx")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npx", "yarn")
          node.properties["__pnpm__"] = raw.replace("npx", "pnpm dlx")
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        }

        // npm run.
        if (raw.startsWith("npm run")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm run", "yarn")
          node.properties["__pnpm__"] = raw.replace("npm run", "pnpm")
          node.properties["__bun__"] = raw.replace("npm run", "bun")
        }
      }
    },
  },
] as ShikiTransformer[]

const renderTransformers: ShikiTransformer[] = [
  {
    pre(node: HastElement) {
      node.properties["class"] =
        "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent"
    },
    code(node: HastElement) {
      node.properties["data-line-numbers"] = ""
    },
    line(node: HastElement) {
      node.properties["data-line"] = ""
    },
  },
]

export async function highlightCode(code: string, language: string = "tsx") {
  const normalizedLanguage = normalizeLanguage(language)

  // Create cache key from code content and language.
  const cacheKey = createHash("sha256")
    .update(`${normalizedLanguage}:${code}`)
    .digest("hex")

  // Check cache first.
  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const highlighter = await getHighlighter()

  let html: string
  try {
    html = highlighter.codeToHtml(code, {
      lang: normalizedLanguage as HighlightOptions["lang"],
      themes: codeThemes,
      transformers: renderTransformers,
    })
  } catch {
    html = highlighter.codeToHtml(code, {
      lang: "text",
      themes: codeThemes,
      transformers: renderTransformers,
    })
  }

  // Cache the result.
  highlightCache.set(cacheKey, html)

  return html
}
