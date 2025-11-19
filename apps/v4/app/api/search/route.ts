import { createSearchAPI } from "fumadocs-core/search/server"
import { loader } from "fumadocs-core/source"
import { docs } from "@/.source"

// Fumadocs full-text search implementation
// Indexes all MDX content including headings, paragraphs, code blocks, and component exports

const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})

export const { GET } = createSearchAPI("advanced", {
  indexes: source.getPages().map((page) => ({
    id: page.url,
    title: page.data.title,
    description: page.data.description ?? "",
    structuredData: page.data.structuredData,
    url: page.url,
  })),
})
