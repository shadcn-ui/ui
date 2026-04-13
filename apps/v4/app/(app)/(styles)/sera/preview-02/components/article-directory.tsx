"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/styles/base-sera/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/base-sera/ui/table"

type ArticleStatus = "in-revision" | "final-edit" | "drafting" | "published"

type ArticleRow = {
  title: string
  wordProgress: string
  author: string
  issue: string
  status: ArticleStatus
  statusLabel: string
  progress: number
  progressClassName: string
}

const ARTICLE_ROWS: ArticleRow[] = [
  {
    title: "The Future of Sustainable Architecture",
    wordProgress: "1.4k / 2.6k words",
    author: "Elena Rostova",
    issue: "Summer 2024",
    status: "in-revision",
    statusLabel: "In revision",
    progress: 45,
    progressClassName: "w-[45%]",
  },
  {
    title: "Brutalism's Second Act",
    wordProgress: "2.1k / 2.5k words",
    author: "Marcus Chen",
    issue: "Summer 2024",
    status: "final-edit",
    statusLabel: "Final edit",
    progress: 90,
    progressClassName: "w-[90%]",
  },
  {
    title: "The Typography of Public Spaces",
    wordProgress: "0.5k / 1.5k words",
    author: "Sarah Jenkins",
    issue: "Autumn 2024",
    status: "drafting",
    statusLabel: "Drafting",
    progress: 20,
    progressClassName: "w-[20%]",
  },
  {
    title: "Rethinking Urban Canopies",
    wordProgress: "1.8k / 1.8k words",
    author: "David O'Connor",
    issue: "Summer 2024",
    status: "published",
    statusLabel: "Published",
    progress: 100,
    progressClassName: "w-full",
  },
]

function getStatusClasses(status: ArticleStatus): {
  dotClassName: string
  textClassName: string
} {
  if (status === "in-revision") {
    return {
      dotClassName: "bg-amber-600/75",
      textClassName: "text-amber-700 dark:text-amber-300",
    }
  }

  if (status === "final-edit") {
    return {
      dotClassName: "bg-foreground/90",
      textClassName: "text-foreground",
    }
  }

  if (status === "drafting") {
    return {
      dotClassName: "bg-muted-foreground/70",
      textClassName: "text-muted-foreground",
    }
  }

  return {
    dotClassName: "bg-muted-foreground/80",
    textClassName: "text-muted-foreground",
  }
}

function PaginationButton({
  children,
  active = false,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Button
      size="icon-sm"
      variant={active ? "default" : "ghost"}
      className={cn(
        "size-8 border text-[11px] tracking-[0.12em]",
        active
          ? "border-foreground bg-foreground text-background hover:bg-foreground/90"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-transparent hover:text-foreground"
      )}
    >
      {children}
    </Button>
  )
}

export function ArticleDirectory() {
  return (
    <section className="flex min-h-[860px] flex-col border border-border/70 bg-background">
      <div className="flex flex-col gap-3 p-4 md:hidden">
        {ARTICLE_ROWS.map((row) => {
          const statusClasses = getStatusClasses(row.status)

          return (
            <article key={row.title} className="flex flex-col gap-3 border border-border/70 p-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-xl leading-tight tracking-tight">{row.title}</h2>
                <p className="text-xs text-muted-foreground">{row.wordProgress}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Author
                  </span>
                  <span>{row.author}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Issue
                  </span>
                  <span>{row.issue}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase",
                    statusClasses.textClassName
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", statusClasses.dotClassName)} />
                  <span>{row.statusLabel}</span>
                </div>
                <span className="text-xs font-medium">{row.progress}%</span>
              </div>

              <div className="relative h-px w-full bg-border">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 bg-foreground",
                    row.progressClassName
                  )}
                />
              </div>
            </article>
          )
        })}

        <footer className="flex items-center justify-between gap-4 border border-border/70 p-4">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Showing 4 of 24
          </p>
          <div className="flex items-center gap-1">
            <PaginationButton>
              <ChevronLeftIcon className="size-3.5" />
            </PaginationButton>
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationButton>
              <ChevronRightIcon className="size-3.5" />
            </PaginationButton>
          </div>
        </footer>
      </div>

      <div className="hidden min-h-[860px] md:flex md:flex-col">
        <Table>
          <TableHeader className="[&_tr]:border-border/70">
            <TableRow className="h-12 hover:bg-transparent">
              <TableHead className="px-6 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Title
              </TableHead>
              <TableHead className="w-[170px] px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Author
              </TableHead>
              <TableHead className="w-[150px] px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Issue
              </TableHead>
              <TableHead className="w-[180px] px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="w-[200px] px-6 text-right text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Progress
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {ARTICLE_ROWS.map((row) => {
              const statusClasses = getStatusClasses(row.status)

              return (
                <TableRow key={row.title} className="h-20 border-border/60 hover:bg-transparent">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-heading text-3xl leading-none tracking-tight text-foreground">
                        {row.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{row.wordProgress}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm text-foreground">
                    {row.author}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm text-foreground">
                    {row.issue}
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase",
                        statusClasses.textClassName
                      )}
                    >
                      <span
                        className={cn("size-1.5 rounded-full", statusClasses.dotClassName)}
                      />
                      <span>{row.statusLabel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <div className="relative h-px w-16 bg-border">
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 bg-foreground",
                            row.progressClassName
                          )}
                        />
                      </div>
                      <span className="w-9 text-right text-[11px] font-medium">
                        {row.progress}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <div className="flex-1 border-t border-border/60" />

        <footer className="flex items-center justify-between gap-4 border-t border-border/70 px-6 py-4">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Showing 4 of 24 articles
          </p>
          <div className="flex items-center gap-1">
            <PaginationButton>
              <ChevronLeftIcon className="size-3.5" />
            </PaginationButton>
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationButton>
              <ChevronRightIcon className="size-3.5" />
            </PaginationButton>
          </div>
        </footer>
      </div>
    </section>
  )
}
