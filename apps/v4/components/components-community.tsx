"use client"

import * as React from "react"
import { ArrowUpRightIcon, Loader2Icon, SearchIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

export function ComponentsCommunitySearch({
  className,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("grid gap-4", className)}>
      <ComponentsCommunitySearchForm />
      <ComponentsCommunitySearchResults />
    </div>
  )
}

interface SearchResponse {
  items: z.infer<typeof registryItemSchema>[]
  total: number
  hasMore: boolean
}

function ComponentsCommunitySearchForm() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 150,
  })
  const [isSearching, setIsSearching] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement
        const isInputFocused =
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement
        if (!isInputFocused) {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="relative">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        ref={inputRef}
        placeholder="Search components..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setIsSearching(true)
          setTimeout(() => setIsSearching(false), 300)
        }}
        className="pr-9 pl-9 shadow-none"
      />
      {isSearching && (
        <Loader2Icon className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
      )}
    </div>
  )
}

function ComponentsCommunityResults({
  items,
}: {
  items: z.infer<typeof registryItemSchema>[]
}) {
  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-sm">
        <p className="text-muted-foreground text-balance">
          No components found for this search. Try a different search term.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-1">
      {items.map((item, index) => (
        <a
          key={`${item.type}-${item.name}-${index}`}
          href={`${item.meta?.url ?? ""}?utm_source=shadcn-ui&utm_medium=referral&utm_campaign=components-community`}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 flex h-16 flex-col gap-1 rounded-md p-3 transition-colors outline-none focus-visible:ring-[3px]"
          title={`${item.name} - ${item.description}`}
        >
          <div className="flex items-center gap-1 leading-none font-medium underline-offset-4">
            {item.name}{" "}
            {item.meta?.registryName && (
              <div className="text-muted-foreground ml-auto flex items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.meta.registryName}
                <ArrowUpRightIcon className="size-3" />
              </div>
            )}
          </div>
          {item.description && (
            <div className="text-muted-foreground line-clamp-1 max-w-[80%] text-sm">
              {item.description}
            </div>
          )}
        </a>
      ))}
    </div>
  )
}

function ComponentsCommunitySkeleton() {
  return (
    <div className="grid gap-1">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="flex h-16 flex-col gap-1 rounded-md p-3">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-full max-w-[90%] rounded-md" />
        </div>
      ))}
    </div>
  )
}

function ComponentsCommunitySearchResults() {
  const [search] = useQueryState("q", { defaultValue: "" })
  const [items, setItems] = React.useState<
    z.infer<typeof registryItemSchema>[]
  >([])
  const [loading, setLoading] = React.useState(true)
  const [hasMore, setHasMore] = React.useState(false)
  const [offset, setOffset] = React.useState(0)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const searchCacheRef = React.useRef<Map<string, SearchResponse>>(new Map())

  const performSearch = React.useCallback(
    async (query: string, currentOffset = 0) => {
      const cacheKey = `${query}:${currentOffset}`
      const cached = searchCacheRef.current.get(cacheKey)
      if (cached && currentOffset === 0) {
        setItems(cached.items)
        setHasMore(cached.hasMore)
        setOffset(0)
        return
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      setLoading(true)

      try {
        const params = new URLSearchParams({
          q: query,
          limit: "20",
          offset: currentOffset.toString(),
        })

        const response = await fetch(`/api/search/community?${params}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Search failed")
        }

        const data: SearchResponse = await response.json()

        searchCacheRef.current.set(cacheKey, data)

        if (currentOffset === 0) {
          setItems(data.items)
        } else {
          setItems((prev) => [...prev, ...data.items])
        }

        setHasMore(data.hasMore)
        setOffset(currentOffset)
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error)
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  React.useEffect(() => {
    performSearch(search, 0)
  }, [search, performSearch])

  const loadMore = React.useCallback(() => {
    if (!loading && hasMore) {
      performSearch(search, offset + 20)
    }
  }, [search, offset, loading, hasMore, performSearch])

  if (loading && items.length === 0) {
    return <ComponentsCommunitySkeleton />
  }

  return (
    <>
      <ComponentsCommunityResults items={items} />
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="secondary"
            size="sm"
          >
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </>
  )
}
