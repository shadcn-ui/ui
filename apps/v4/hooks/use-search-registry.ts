import * as React from "react"
import { debounce, parseAsInteger, useQueryState } from "nuqs"
import useSWRImmutable from "swr/immutable"

import {
  createRegistryDirectoryView,
  getRegistryDirectoryPage,
} from "@/lib/registry-health/directory"
import { useMounted } from "@/hooks/use-mounted"
import globalRegistries from "@/registry/directory.json"

async function fetchRegistryMetadata(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!response.ok) {
    throw new Error("Registry health is unavailable")
  }
  return { payload: await response.json(), fetchedAt: Date.now() }
}

export function useSearchRegistry() {
  const mounted = useMounted()
  const [now] = React.useState(() => Date.now())
  const { data, isLoading } = useSWRImmutable(
    mounted ? "/r/registries.json" : null,
    fetchRegistryMetadata,
    { shouldRetryOnError: false }
  )
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    limitUrlUpdates: debounce(250),
  })

  const [page, setPage] = useQueryState("page", {
    ...parseAsInteger,
    defaultValue: 1,
    history: "push",
  })

  const currentQuery = mounted ? query : ""
  const currentPageValue = mounted ? page : 1

  const view = React.useMemo(
    () =>
      createRegistryDirectoryView(
        globalRegistries,
        data?.payload,
        Math.max(data?.fetchedAt ?? now, now)
      ),
    [data, now]
  )
  const result = getRegistryDirectoryPage(view, {
    query: currentQuery,
    page: currentPageValue,
  })

  return {
    ...result,
    isLoading: !mounted || isLoading,
    query: currentQuery,
    setQuery: (value: string | null) => {
      setQuery(value)
      setPage(null)
    },
    setPage,
  }
}
