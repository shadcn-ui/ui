"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useSearchRegistry } from "@/hooks/use-search-registry"
import {
  DirectoryAddButton,
  DirectoryAddProvider,
} from "@/components/directory-add-button"
import { Button, buttonVariants } from "@/styles/base-nova/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/styles/base-nova/ui/item"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/styles/base-nova/ui/pagination"
import { Skeleton } from "@/styles/base-nova/ui/skeleton"

import { SearchDirectory } from "./directory-search"

function getHomepageUrl(homepage: string) {
  const url = new URL(homepage)
  url.searchParams.set("utm_source", "ui.shadcn.com")
  url.searchParams.set("utm_medium", "referral")
  url.searchParams.set("utm_campaign", "directory")
  return url.toString()
}

function getPageHref(pathname: string, query: string, page: number) {
  const searchParams = new URLSearchParams()

  if (query) {
    searchParams.set("q", query)
  }

  if (page > 1) {
    searchParams.set("page", page.toString())
  }

  const search = searchParams.toString()

  return search ? `${pathname}?${search}` : pathname
}

function getPageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1) as (
      | number
      | "ellipsis"
    )[]
  }

  const pages: (number | "ellipsis")[] = [1]

  // Show ellipsis or page 2 directly if only one number would be hidden.
  if (current > 4) {
    pages.push("ellipsis")
  } else if (current >= 4) {
    pages.push(2)
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Show ellipsis or second-to-last page directly if only one number would be hidden.
  if (current < total - 3) {
    pages.push("ellipsis")
  } else if (current <= total - 3) {
    pages.push(total - 1)
  }

  pages.push(total)

  return pages
}

type DirectoryPaginationLinkProps = React.ComponentProps<"a"> & {
  isActive?: boolean
  size?: React.ComponentProps<typeof Button>["size"]
}

function DirectoryPaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: DirectoryPaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function DirectoryPaginationPrevious({
  className,
  text = "Previous",
  ...props
}: DirectoryPaginationLinkProps & { text?: string }) {
  return (
    <DirectoryPaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <IconChevronLeft className="cn-rtl-flip size-4" />
      <span className="hidden sm:block">{text}</span>
    </DirectoryPaginationLink>
  )
}

function DirectoryPaginationNext({
  className,
  text = "Next",
  ...props
}: DirectoryPaginationLinkProps & { text?: string }) {
  return (
    <DirectoryPaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <IconChevronRight className="cn-rtl-flip size-4" />
    </DirectoryPaginationLink>
  )
}

export function DirectoryList() {
  const pathname = usePathname()
  const {
    isLoading,
    paginatedRegistries,
    page,
    query,
    registries,
    totalPages,
    setPage,
    setQuery,
  } = useSearchRegistry()
  const previousHref =
    page > 1 ? getPageHref(pathname, query, page - 1) : undefined
  const nextHref =
    page < totalPages ? getPageHref(pathname, query, page + 1) : undefined

  const handlePageChange = React.useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      targetPage: number,
      disabled = false
    ) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      if (disabled || targetPage === page) {
        event.preventDefault()
        return
      }

      event.preventDefault()
      void setPage(targetPage)
    },
    [page, setPage]
  )

  return (
    <DirectoryAddProvider>
      <div className="mt-6">
        {isLoading ? (
          <DirectoryListSkeleton />
        ) : (
          <>
            <SearchDirectory
              query={query}
              registriesCount={registries.length}
              setQuery={setQuery}
            />
            <ItemGroup className="my-8">
              {paginatedRegistries.map((registry, index) => (
                <React.Fragment key={registry.name}>
                  <Item className="group/item relative gap-6 px-0">
                    <ItemMedia
                      variant="image"
                      dangerouslySetInnerHTML={{ __html: registry.logo }}
                      className="grayscale *:[svg]:size-8 *:[svg]:fill-foreground"
                    />
                    <ItemContent>
                      <ItemTitle>
                        <a
                          href={getHomepageUrl(registry.homepage)}
                          target="_blank"
                          rel="noopener noreferrer external"
                          className="group flex items-center gap-1"
                        >
                          {registry.name}{" "}
                          <IconArrowUpRight className="size-4 opacity-0 group-hover:opacity-100" />
                        </a>
                      </ItemTitle>
                      {registry.description && (
                        <ItemDescription className="text-pretty">
                          {registry.description}
                        </ItemDescription>
                      )}
                    </ItemContent>
                    <ItemActions className="relative z-10 hidden self-start sm:flex">
                      <DirectoryAddButton registry={registry} />
                    </ItemActions>
                    <ItemFooter className="justify-start pl-16 sm:hidden">
                      <Button size="sm" variant="outline">
                        View <IconArrowUpRight />
                      </Button>
                      <DirectoryAddButton registry={registry} />
                    </ItemFooter>
                  </Item>
                  {index < paginatedRegistries.length - 1 && (
                    <ItemSeparator className="my-1" />
                  )}
                </React.Fragment>
              ))}
            </ItemGroup>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <DirectoryPaginationPrevious
                      href={previousHref}
                      aria-disabled={page <= 1 || undefined}
                      tabIndex={page <= 1 ? -1 : undefined}
                      onClick={(event) =>
                        handlePageChange(event, page - 1, page <= 1)
                      }
                      className={cn(
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      )}
                    />
                  </PaginationItem>
                  {getPageNumbers(page, totalPages).map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <DirectoryPaginationLink
                          href={getPageHref(pathname, query, p)}
                          isActive={p === page}
                          onClick={(event) => handlePageChange(event, p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </DirectoryPaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <DirectoryPaginationNext
                      href={nextHref}
                      aria-disabled={page >= totalPages || undefined}
                      tabIndex={page >= totalPages ? -1 : undefined}
                      onClick={(event) =>
                        handlePageChange(event, page + 1, page >= totalPages)
                      }
                      className={cn(
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </DirectoryAddProvider>
  )
}

function DirectoryListSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-full rounded-lg" />
      <ItemGroup className="my-8">
        {Array.from({ length: 10 }, (_, index) => (
          <React.Fragment key={index}>
            <Item className="relative items-start gap-6 px-0">
              <Skeleton className="size-8 rounded-lg" />
              <ItemContent>
                <Skeleton className="h-4 w-32 sm:w-40" />
                <Skeleton className="mt-1.5 h-4 w-full max-w-md" />
                <Skeleton className="mt-1 h-4 w-3/4 max-w-sm" />
              </ItemContent>
              <ItemActions className="hidden self-start sm:flex">
                <Skeleton className="h-7 w-16 rounded-lg" />
              </ItemActions>
              <ItemFooter className="justify-start gap-2 pl-16 sm:hidden">
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </ItemFooter>
            </Item>
            {index < 9 && <ItemSeparator className="my-1" />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </>
  )
}
