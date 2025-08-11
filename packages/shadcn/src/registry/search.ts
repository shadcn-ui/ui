import { Config } from "@/src/utils/get-config"
import fuzzysort from "fuzzysort"
import { z } from "zod"

import { getRegistry } from "./api"

const searchResultItemSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  description: z.string().optional(),
  registry: z.string(),
})

const searchResultsSchema = z.object({
  pagination: z.object({
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  }),
  items: z.array(searchResultItemSchema),
})

export async function searchRegistries(
  registries: Array<Parameters<typeof getRegistry>[0]>,
  options?: {
    query?: string
    limit?: number
    offset?: number
  },
  config?: Partial<Config>
) {
  let allItems: z.infer<typeof searchResultItemSchema>[] = []

  for (const registry of registries) {
    const registryData = await getRegistry(registry, config)

    const itemsWithRegistry = (registryData.items || []).map((item: any) => ({
      name: item.name,
      type: item.type,
      description: item.description,
      registry: registry,
    }))

    allItems = allItems.concat(itemsWithRegistry)
  }

  // Apply search if query is provided
  if (options?.query) {
    allItems = searchItems(allItems, {
      query: options.query,
      // No limit here - we want to search all items then paginate
      limit: allItems.length,
      keys: ["name", "description"],
    }) as z.infer<typeof searchResultItemSchema>[]
  }

  // Apply offset and limit pagination
  const offset = options?.offset || 0
  const limit = options?.limit || allItems.length
  const totalItems = allItems.length

  // Build result with pagination
  const result: z.infer<typeof searchResultsSchema> = {
    pagination: {
      total: totalItems,
      offset,
      limit,
      hasMore: offset + limit < totalItems,
    },
    items: allItems.slice(offset, offset + limit),
  }

  return searchResultsSchema.parse(result)
}

const searchableItemSchema = z
  .object({
    name: z.string(),
    type: z.string().optional(),
    description: z.string().optional(),
    registry: z.string().optional(), // Optional for backward compatibility
  })
  .passthrough()

type SearchableItem = z.infer<typeof searchableItemSchema>

function searchItems<
  T extends {
    name: string
    type?: string
    description?: string
    [key: string]: any
  } = SearchableItem
>(
  items: T[],
  options: {
    query: string
  } & Pick<Parameters<typeof fuzzysort.go>[2], "keys" | "threshold" | "limit">
) {
  options = {
    limit: 100,
    threshold: -10000,
    ...options,
  }

  const searchResults = fuzzysort.go(options.query, items, {
    keys: options.keys,
    threshold: options.threshold,
    limit: options.limit,
  })

  const results = searchResults.map((result) => result.obj)

  return z.array(searchableItemSchema).parse(results)
}
