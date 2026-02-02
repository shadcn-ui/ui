"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"
import { useDocsSearch } from "fumadocs-core/search/client"
import { CornerDownLeftIcon, SquareDashedIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { type Color, type ColorPalette } from "@/lib/colors"
import { trackEvent } from "@/lib/events"
import { showMcpDocs } from "@/lib/flags"
import { getCurrentBase, getPagesFromFolder } from "@/lib/page-tree"
import { type source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useMutationObserver } from "@/hooks/use-mutation-observer"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

export function CommandMenu({
  tree,
  colors,
  blocks,
  navItems,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  tree: typeof source.pageTree
  colors: ColorPalette[]
  blocks?: { name: string; description: string; categories: string[] }[]
  navItems?: { href: string; label: string }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [config] = useConfig()
  const currentBase = getCurrentBase(pathname)
  const [open, setOpen] = React.useState(false)
  const [renderDelayedGroups, setRenderDelayedGroups] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<
    "color" | "page" | "component" | "block" | null
  >(null)
  const [copyPayload, setCopyPayload] = React.useState("")

  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
  })
  const packageManager = config.packageManager || "pnpm"

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)
  const lastTrackedQueryRef = React.useRef<string>("")

  const trackSearchQuery = React.useCallback((query: string) => {
    const trimmedQuery = query.trim()
    if (trimmedQuery && trimmedQuery !== lastTrackedQueryRef.current) {
      lastTrackedQueryRef.current = trimmedQuery
      trackEvent({
        name: "search_query",
        properties: {
          query: trimmedQuery,
          query_length: trimmedQuery.length,
        },
      })
    }
  }, [])

  const handleSearchChange = React.useCallback(
    (value: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        React.startTransition(() => {
          setSearch(value)
          trackSearchQuery(value)
        })
      }, 500)
    },
    [setSearch, trackSearchQuery]
  )

  React.useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        setRenderDelayedGroups(true)
      })

      return () => {
        cancelAnimationFrame(frame)
      }
    }

    setRenderDelayedGroups(false)
  }, [open])

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const commandFilter = React.useCallback(
    (value: string, searchValue: string, keywords?: string[]) => {
      const extendValue = value + " " + (keywords?.join(" ") || "")
      if (extendValue.toLowerCase().includes(searchValue.toLowerCase())) {
        return 1
      }
      return 0
    },
    []
  )

  const handlePageHighlight = React.useCallback(
    (isComponent: boolean, item: { url: string; name?: React.ReactNode }) => {
      if (isComponent) {
        const componentName = item.url.split("/").pop()
        setSelectedType("component")
        setCopyPayload(
          `${packageManager} dlx shadcn@latest add ${componentName}`
        )
      } else {
        setSelectedType("page")
        setCopyPayload("")
      }
    },
    [packageManager]
  )

  const handleColorHighlight = React.useCallback((color: Color) => {
    setSelectedType("color")
    setCopyPayload(color.className)
  }, [])

  const handleBlockHighlight = React.useCallback(
    (block: { name: string; description: string; categories: string[] }) => {
      setSelectedType("block")
      setCopyPayload(`${packageManager} dlx shadcn@latest add ${block.name}`)
    },
    [packageManager]
  )

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const navItemsSection = React.useMemo(() => {
    if (!navItems || navItems.length === 0) return null

    return (
      <CommandGroup
        heading="Pages"
        className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
      >
        {navItems.map((item) => (
          <CommandMenuItem
            key={item.href}
            value={`Navigation ${item.label}`}
            keywords={["nav", "navigation", item.label.toLowerCase()]}
            onHighlight={() => {
              setSelectedType("page")
              setCopyPayload("")
            }}
            onSelect={() => runCommand(() => router.push(item.href))}
          >
            <IconArrowRight />
            {item.label}
          </CommandMenuItem>
        ))}
      </CommandGroup>
    )
  }, [navItems, router, runCommand])

  const pageGroupsSection = React.useMemo(() => {
    return tree.children.map((group) => {
      if (group.type !== "folder") return null

      const pages = getPagesFromFolder(group, currentBase).filter((item) => {
        if (!showMcpDocs && item.url.includes("/mcp")) return false
        return true
      })

      if (pages.length === 0) return null

      return (
        <CommandGroup
          key={group.$id}
          heading={group.name}
          className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
        >
          {pages.map((item) => {
            const isComponent = item.url.includes("/components/")
            return (
              <CommandMenuItem
                key={item.url}
                value={
                  item.name?.toString() ? `${group.name} ${item.name}` : ""
                }
                keywords={isComponent ? ["component"] : undefined}
                onHighlight={() => handlePageHighlight(isComponent, item)}
                onSelect={() => runCommand(() => router.push(item.url))}
              >
                {isComponent ? (
                  <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                ) : (
                  <IconArrowRight />
                )}
                {item.name}
              </CommandMenuItem>
            )
          })}
        </CommandGroup>
      )
    })
  }, [tree.children, currentBase, handlePageHighlight, router, runCommand])

  const colorGroupsSection = React.useMemo(() => {
    return colors.map((colorPalette) => (
      <CommandGroup
        key={colorPalette.name}
        heading={
          colorPalette.name.charAt(0).toUpperCase() +
          colorPalette.name.slice(1)
        }
        className="!p-0 [&_[cmdk-group-heading]]:!p-3"
      >
        {colorPalette.colors.map((color) => (
          <CommandMenuItem
            key={color.hex}
            value={color.className}
            keywords={["color", color.name, color.className]}
            onHighlight={() => handleColorHighlight(color)}
            onSelect={() =>
              runCommand(() =>
                copyToClipboardWithMeta(color.oklch, {
                  name: "copy_color",
                  properties: { color: color.oklch },
                })
              )
            }
          >
            <div
              className="border-ghost aspect-square size-4 rounded-sm bg-(--color) after:rounded-sm"
              style={{ "--color": color.oklch } as React.CSSProperties}
            />
            {color.className}
            <span className="text-muted-foreground ml-auto font-mono text-xs">
              {color.oklch}
            </span>
          </CommandMenuItem>
        ))}
      </CommandGroup>
    ))
  }, [colors, handleColorHighlight, runCommand])

  const blocksSection = React.useMemo(() => {
    if (!blocks || blocks.length === 0) return null

    return (
      <CommandGroup
        heading="Blocks"
        className="!p-0 [&_[cmdk-group-heading]]:!p-3"
      >
        {blocks.map((block) => (
          <CommandMenuItem
            key={block.name}
            value={block.name}
            keywords={[
              "block",
              block.name,
              block.description,
              ...block.categories,
            ]}
            onHighlight={() => handleBlockHighlight(block)}
            onSelect={() =>
              runCommand(() =>
                router.push(`/blocks/${block.categories[0]}#${block.name}`)
              )
            }
          >
            <SquareDashedIcon />
            {block.description}
            <span className="text-muted-foreground ml-auto font-mono text-xs">
              {block.name}
            </span>
          </CommandMenuItem>
        ))}
      </CommandGroup>
    )
  }, [blocks, handleBlockHighlight, router, runCommand])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }

      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        runCommand(() => {
          if (selectedType === "color") {
            copyToClipboardWithMeta(copyPayload, {
              name: "copy_color",
              properties: { color: copyPayload },
            })
          }

          if (selectedType === "block" || selectedType === "page" || selectedType === "component") {
            copyToClipboardWithMeta(copyPayload, {
              name: "copy_npm_command",
              properties: { command: copyPayload, pm: packageManager },
            })
          }
        })
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [copyPayload, runCommand, selectedType, packageManager])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-foreground dark:bg-card hover:bg-muted/50 relative h-8 w-full justify-start rounded-lg pl-3 font-normal shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64"
          onClick={() => setOpen(true)}
          {...props}
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command filter={commandFilter}>
          <div className="relative">
            <CommandInput
              placeholder="Search documentation..."
              onValueChange={handleSearchChange}
            />
            {query.isLoading && (
              <div className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2">
                <Spinner className="text-muted-foreground size-4" />
              </div>
            )}
          </div>
          <CommandList className="min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              {query.isLoading ? "Searching..." : "No results found."}
            </CommandEmpty>
            {navItemsSection}
            {renderDelayedGroups && (
              <>
                {pageGroupsSection}
                {colorGroupsSection}
                {blocksSection}
                <SearchResults
                  setOpen={setOpen}
                  query={query}
                  search={search}
                />
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.()
      }
    })
  })

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}

type Query = Awaited<ReturnType<typeof useDocsSearch>>["query"]

function SearchResults({
  setOpen,
  query,
  search,
}: {
  setOpen: (open: boolean) => void
  query: Query
  search: string
}) {
  const router = useRouter()

  const uniqueResults = React.useMemo(() => {
    if (!query.data || !Array.isArray(query.data)) return []
    return query.data.filter(
      (item, index, self) =>
        !(
          item.type === "text" &&
          item.content.trim().split(/\s+/).length <= 1
        ) && index === self.findIndex((t) => t.content === item.content)
    )
  }, [query.data])

  if (!search.trim() || !query.data || uniqueResults.length === 0) return null

  return (
    <CommandGroup heading="Search Results">
      {uniqueResults.map((item) => (
        <CommandItem
          key={item.id}
          onSelect={() => {
            router.push(item.url)
            setOpen(false)
          }}
          value={`${item.content} ${item.type}`}
        >
          <div className="line-clamp-1 text-sm">{item.content}</div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogPrimitive.Content
        className={cn(
          "bg-background fixed top-1/3 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg outline-none sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
