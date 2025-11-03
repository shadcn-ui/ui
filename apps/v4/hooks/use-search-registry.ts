import { useQueryState } from "nuqs"

import globalRegistries from "@/registry/directory.json"

const normilizeQuery = (query: string) =>
  query.toLowerCase().replaceAll(" ", "").replaceAll("@", "")

function finderFn<T extends (typeof globalRegistries)[0]>(
  registry: T,
  query: string
) {
  const normilizedName = normilizeQuery(registry.name)
  const normilizedDecription = normilizeQuery(registry.description)
  const normilizedQuery = normilizeQuery(query)

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
  const [query, setQuery] = useQueryState("q")

  return {
    query,
    registries: searchDirectory(query),
    setQuery,
  }
}
