import { debounce, useQueryState } from "nuqs"

import globalRegistries from "@/registry/directory.json"

const normalizeQuery = (value: string) =>
  value.toLowerCase().replaceAll(" ", "").replaceAll("@", "")

function matchesRegistry(
  registry: (typeof globalRegistries)[0],
  query: string
): boolean {
  const normalizedQuery = normalizeQuery(query)
  const nameMatch = normalizeQuery(registry.name).includes(normalizedQuery)
  const descriptionMatch = normalizeQuery(
    registry.description ?? ""
  ).includes(normalizedQuery)
  return nameMatch || descriptionMatch
}

const searchDirectory = (query: string | null) => {
  if (!query) return globalRegistries

  return globalRegistries.filter((registry) => matchesRegistry(registry, query))
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
