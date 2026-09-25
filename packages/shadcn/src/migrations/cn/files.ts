import { promises as fs } from "fs"
import path from "path"
import globby from "globby"
import { ScriptKind } from "ts-morph"

import type { SourceRegion } from "./types"

const SOURCE_PATTERN = "**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts,vue,svelte,astro}"
const SOURCE_IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.next/**",
  "**/.nuxt/**",
  "**/.svelte-kit/**",
  "**/.astro/**",
  "**/.output/**",
  "**/.vercel/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/coverage/**",
]

export async function resolveMigrationFiles(cwd: string, migratePath?: string) {
  if (!migratePath) {
    return findSourceFiles(cwd)
  }

  if (migratePath.includes("*")) {
    const files = await findSourceFiles(cwd, migratePath)
    if (!files.length) {
      throw new Error(`No files found matching: ${migratePath}`)
    }
    return files
  }

  const resolvedPath = path.resolve(cwd, migratePath)
  const stat = await fs.stat(resolvedPath).catch(() => null)
  if (!stat) {
    throw new Error(`File not found: ${migratePath}`)
  }

  if (stat.isFile()) {
    return [resolvedPath]
  }

  if (stat.isDirectory()) {
    const files = await findSourceFiles(resolvedPath)
    if (!files.length) {
      throw new Error(`No files found matching: ${migratePath}`)
    }
    return files
  }

  throw new Error(`Unsupported path type: ${migratePath}`)
}

function findSourceFiles(cwd: string, pattern = SOURCE_PATTERN) {
  return globby(pattern, {
    cwd,
    absolute: true,
    onlyFiles: true,
    ignore: SOURCE_IGNORE,
    suppressErrors: true,
    dot: true,
    gitignore: true,
  })
}

export function getScriptRegions(content: string, filename: string) {
  const regions: SourceRegion[] = []
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script(?:\s[^>]*)?>/gi
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    const attributes = match[1]
    const source = match[2]
    const offset = match[0].indexOf(source)
    const language = attributes.match(/\blang=["'](js|jsx|ts|tsx)["']/i)?.[1]
    regions.push({
      start: match.index + offset,
      end: match.index + offset + source.length,
      filename: `${filename}.${regions.length}.${language?.toLowerCase() ?? "js"}`,
    })
  }

  return regions
}

export function getAstroFrontmatterRegions(content: string, filename: string) {
  const match = content.match(/^(?:\uFEFF)?---[\t ]*\r?\n([\s\S]*?)\r?\n---/)
  if (!match || match.index === undefined) {
    return []
  }

  const source = match[1]
  const offset = match[0].indexOf(source)
  return [
    {
      start: match.index + offset,
      end: match.index + offset + source.length,
      filename: `${filename}.frontmatter.ts`,
    },
  ]
}

export function normalizeVirtualFilename(filename: string) {
  const basename = path.basename(filename).replace(/[^a-zA-Z0-9_.-]/g, "-")
  return basename.match(/\.(?:js|jsx|ts|tsx|mjs|mts|cjs|cts)$/)
    ? `/${basename}`
    : `/${basename}.tsx`
}

export function getScriptKind(filename: string) {
  switch (path.extname(filename).toLowerCase()) {
    case ".ts":
    case ".mts":
    case ".cts":
      return ScriptKind.TS
    case ".tsx":
      return ScriptKind.TSX
    case ".jsx":
      return ScriptKind.JSX
    default:
      return ScriptKind.JS
  }
}
