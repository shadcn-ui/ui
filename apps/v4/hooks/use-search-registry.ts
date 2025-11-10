import { debounce, useQueryState } from "nuqs"

import globalRegistries from "@/registry/directory.json"

const normalizeQuery = (query: string) =>
  query.toLowerCase().replaceAll(" ", "").replaceAll("@", "")

function finderFn<T extends (typeof globalRegistries)[0]>(
  registry: T,
  query: string
) {
  const normilizedName = normalizeQuery(registry.name)
  const normilizedDecription = normalizeQuery(registry.description)
  const normilizedQuery = normalizeQuery(query)

  return (
    normilizedName.includes(normilizedQuery) ||
    normilizedDecription.includes(normilizedQuery)
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
