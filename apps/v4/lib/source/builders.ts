import type { ComponentType } from "react"
import type { Page, PageData, PageMetadata } from "./types"

/**
 * Build a complete Page object from metadata
 * Centralizes the page construction logic to eliminate duplication
 */
export function buildPageFromMetadata(
  metadata: PageMetadata,
  data?: Partial<PageData>
): Page {
  const pathStr = metadata.slug.join("/") || "index"
  const name = metadata.slug.length > 0 
    ? metadata.slug[metadata.slug.length - 1] 
    : "index"
  const dirname = metadata.slug.length > 1 
    ? metadata.slug.slice(0, -1).join("/") 
    : ""

  return {
    data: {
      title: metadata.title,
      description: metadata.description,
      links: metadata.links,
      component: metadata.component,
      // Default empty values, can be overridden by data param
      body: (() => null) as ComponentType<Record<string, unknown>>,
      toc: [],
      ...data,
    },
    url: metadata.url,
    slugs: metadata.slug,
    file: {
      path: `${pathStr}.mdx`,
      name,
      ext: ".mdx",
      dirname,
      flattenedPath: pathStr,
    },
    path: `${pathStr}.mdx`,
    absolutePath: `/content/${pathStr}.mdx`,
  }
}
