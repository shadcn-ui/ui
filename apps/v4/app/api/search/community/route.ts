import { promises as fs } from "fs"
import path from "path"
import type { Orama } from "@orama/orama"
import { create, load, search } from "@orama/orama"
import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

type RegistryItem = z.infer<typeof registryItemSchema>

const searchSchema = {
  name: "string",
  description: "string",
  type: "string",
  author: "string",
  url: "string",
  registryName: "string",
} as const

let searchDb: Orama<typeof searchSchema> | null = null

async function getSearchDb() {
  if (searchDb) return searchDb

  try {
    const indexPath = path.join(
      process.cwd(),
      ".data",
      "external-registries-index.json"
    )
    const indexData = await fs.readFile(indexPath, "utf-8")
    const savedDb = JSON.parse(indexData)

    searchDb = await create({
      schema: searchSchema,
    })

    await load(searchDb, savedDb)
    return searchDb
  } catch (error) {
    console.error("Failed to load search index:", error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (!query) {
      // Return all items if no query
      const registryPath = path.join(
        process.cwd(),
        ".data",
        "external-registries.json"
      )

      try {
        const data = await fs.readFile(registryPath, "utf-8")
        const registry = JSON.parse(data)

        const items = registry.items.slice(offset, offset + limit)
        return Response.json(
          {
            items,
            total: registry.items.length,
            hasMore: offset + limit < registry.items.length,
          },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=3600, stale-while-revalidate=86400",
            },
          }
        )
      } catch {
        return Response.json({
          items: [],
          total: 0,
          hasMore: false,
        })
      }
    }

    // Search using Orama
    const db = await getSearchDb()
    if (!db) {
      // No search index - return empty results
      return Response.json({
        items: [],
        total: 0,
        hasMore: false,
      })
    }

    const results = await search(db, {
      term: query,
      limit,
      offset,
    })

    console.log(`Search query: "${query}", found ${results.count} results`)

    // Load the full registry to get complete item data
    const registryPath = path.join(
      process.cwd(),
      ".data",
      "external-registries.json"
    )

    try {
      const data = await fs.readFile(registryPath, "utf-8")
      const registry = JSON.parse(data)

      // Map search results to full items
      const items = results.hits
        .map((hit) => {
          return registry.items.find(
            (item: RegistryItem) => item.name === hit.document.name
          )
        })
        .filter(Boolean)

      return Response.json(
        {
          items,
          total: results.count,
          hasMore: offset + limit < results.count,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      )
    } catch {
      return Response.json({
        items: [],
        total: 0,
        hasMore: false,
      })
    }
  } catch (error) {
    console.error("Search API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
