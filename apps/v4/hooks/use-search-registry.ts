import { debounce, useQueryState } from "nuqs"

import globalRegistries from "@/registry/directory.json"

const normalizeQuery = (query: string) =>
  query.toLowerCase().replaceAll(" ", "").replaceAll("@", "")

function finderFn<T extends (typeof globalRegistries)[0]>(
  registry: T,
  query: string
) {
  const normalizedName = normalizeQuery(registry.name)
  const normalizedDecription = normalizeQuery(registry.description)
  const normalizedQuery = normalizeQuery(query)

  return (
    normalizedName.includes(normalizedQuery) ||
    normalizedDecription.includes(normalizedQuery)
  )
}

const searchDirectory = (query: string | null) => {
  if (!query) return globalRegistries

  return globalRegistries.filter((registry) => finderFn(registry, query))
}

export const useSearchRegistry = () => {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    limitUrlUpdates: debounce(250),
  })

  return {
    query,
    registries: searchDirectory(query),
    setQuery,
  }
}
