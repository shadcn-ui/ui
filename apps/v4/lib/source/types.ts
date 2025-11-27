import type { ComponentType } from "react"

/**
 * Metadata for a single documentation page
 * Used for navigation, search, and static generation without loading MDX content
 */
export type PageMetadata = {
  slug: string[]
  url: string
  title: string
  description?: string
  links?: {
    doc?: string
    api?: string
  }
  component?: boolean
}

/**
 * Page tree node for navigation sidebar
 * Can be a folder, page, or separator
 */
export type PageTreeNode = {
  type: "folder" | "page" | "separator"
  name: string
  url?: string
  external?: boolean
  $id?: string
  children?: PageTreeNode[]
}

/**
 * Full page data including MDX content
 * Only loaded when rendering a specific page
 */
export type PageData = {
  title: string
  description?: string
  links?: {
    doc?: string
    api?: string
  }
  component?: boolean
  body: ComponentType<Record<string, unknown>>
  toc: Array<{
    title: string
    url: string
    depth: number
  }>
}

/**
 * Complete page object with metadata and file info
 * Compatible with Fumadocs loader API
 */
export type Page = {
  data: PageData
  url: string
  slugs: string[]
  file: {
    path: string
    name: string
    ext: string
    dirname: string
    flattenedPath: string
  }
  path: string
  absolutePath: string
}

/**
 * Import map function signature
 * Maps slug strings to dynamic import functions
 */
export type ImportFunction = () => Promise<{
  default: ComponentType<Record<string, unknown>>
  toc?: Array<{
    title: string
    url: string
    depth: number
  }>
}>

export type ImportMap = Record<string, ImportFunction>
