"use client"

import * as React from "react"
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  FileTextIcon,
  FilterIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/styles/base-sera/ui/avatar"
import { Badge } from "@/styles/base-sera/ui/badge"
import { Button } from "@/styles/base-sera/ui/button"
import { Progress, ProgressTrack, ProgressValue } from "@/styles/base-sera/ui/progress"
import { Separator } from "@/styles/base-sera/ui/separator"

type PipelineStatus = "draft" | "active" | "archived"
type AlertTone = "neutral" | "warning"
type ColumnKey = "planning" | "in-progress" | "published"

type IssueCard = {
  title: string
  volume: string
  status: PipelineStatus
  dueLabel: string
  articleCount: number
  progress: number
  assignees: string[]
  alert?: {
    title: string
    message: string
    tone: AlertTone
  }
}

type PipelineColumn = {
  key: ColumnKey
  title: string
  count: number
  cards: IssueCard[]
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    key: "planning",
    title: "Planning",
    count: 1,
    cards: [
      {
        title: "Winter Issue",
        volume: "Vol 4. / Issue 12",
        status: "draft",
        dueLabel: "Due Nov 15",
        articleCount: 12,
        progress: 10,
        assignees: ["MS", "LI"],
      },
    ],
  },
  {
    key: "in-progress",
    title: "In Progress",
    count: 2,
    cards: [
      {
        title: "Fall Issue",
        volume: "Vol 4. / Issue 11",
        status: "active",
        dueLabel: "Due Oct 01",
        articleCount: 14,
        progress: 85,
        assignees: ["AS", "EP"],
        alert: {
          title: "Layout Review",
          message: "Awaiting final sign-off from art director.",
          tone: "neutral",
        },
      },
      {
        title: "Summer Issue",
        volume: "Vol 4. / Issue 10",
        status: "active",
        dueLabel: "Due Jul 15",
        articleCount: 15,
        progress: 45,
        assignees: ["AS", "KL"],
        alert: {
          title: "1 block overdue",
          message: "Photography needs final sign-off.",
          tone: "warning",
        },
      },
    ],
  },
  {
    key: "published",
    title: "Published",
    count: 1,
    cards: [
      {
        title: "Spring Issue",
        volume: "Vol 4. / Issue 09",
        status: "archived",
        dueLabel: "Pub Apr 15",
        articleCount: 12,
        progress: 100,
        assignees: ["AL", "JI"],
      },
    ],
  },
]

function getBadgeVariant(
  status: PipelineStatus
): React.ComponentProps<typeof Badge>["variant"] {
  if (status === "active") {
    return "outline"
  }

  if (status === "draft") {
    return "secondary"
  }

  return "ghost"
}

function getAlertStyles(tone: AlertTone): { className: string; icon: React.JSX.Element } {
  if (tone === "warning") {
    return {
      className: "border-l border-l-destructive/80 bg-muted/30",
      icon: <CircleAlertIcon className="size-3.5 text-destructive" />,
    }
  }

  return {
    className: "border-l border-l-foreground/80 bg-muted/30",
    icon: <CircleAlertIcon className="size-3.5 text-foreground" />,
  }
}

export function EditorialPipelineBoard() {
  return (
    <section className="flex flex-col gap-6 border border-border/70 bg-background p-6 md:p-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-5xl leading-none tracking-tight uppercase">
            Publication Issues
          </h2>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Editorial Pipeline Board
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <FilterIcon className="size-4" />
          </Button>
          <Button size="sm" className="px-4 text-[10px] font-semibold tracking-[0.18em]">
            New Issue
          </Button>
        </div>
      </header>

      <Separator />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {PIPELINE_COLUMNS.map((column) => (
          <section key={column.key} className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] items-end gap-3 border-b border-border/80 pb-2">
              <h3 className="text-[10px] font-semibold tracking-[0.2em] text-foreground uppercase">
                {column.title}
              </h3>
              <span className="inline-flex h-4 min-w-4 items-center justify-center bg-muted px-1 text-[9px] font-semibold text-muted-foreground">
                {column.count}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {column.cards.map((card) => {
                const statusVariant = getBadgeVariant(card.status)

                return (
                  <article
                    key={card.title}
                    className="flex flex-col gap-4 border border-border/60 bg-card p-4"
                  >
                    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-heading text-4xl leading-none tracking-tight">
                          {card.title}
                        </h4>
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                          {card.volume}
                        </p>
                      </div>
                      <Badge
                        variant={statusVariant}
                        className="px-2 py-0.5 text-[9px] tracking-[0.18em] uppercase"
                      >
                        {card.status}
                      </Badge>
                    </div>

                    {card.alert ? (
                      <div
                        className={cn(
                          "flex flex-col gap-1 px-2.5 py-2",
                          getAlertStyles(card.alert.tone).className
                        )}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase">
                          {getAlertStyles(card.alert.tone).icon}
                          <span>{card.alert.title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{card.alert.message}</p>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="size-3.5" />
                        <span>{card.dueLabel}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5">
                        <FileTextIcon className="size-3.5" />
                        <span>{card.articleCount} Articles</span>
                      </div>
                    </div>

                    <Progress value={card.progress} className="gap-1.5">
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold tracking-[0.18em] text-foreground uppercase">
                          Editorial Progress
                        </span>
                        <ProgressValue className="m-0 text-[10px] font-semibold text-foreground">
                          {(value) => `${value}%`}
                        </ProgressValue>
                      </div>
                      <ProgressTrack className="bg-border/90" />
                    </Progress>

                    <footer className="grid grid-cols-[1fr_auto] items-center gap-3">
                      <AvatarGroup className="space-x-0">
                        {card.assignees.map((assignee) => (
                          <Avatar
                            key={assignee}
                            size="sm"
                            className="ring-0 after:border-border/70 [&+[data-slot=avatar]]:-ml-2"
                          >
                            <AvatarFallback className="bg-muted text-[9px] font-semibold tracking-wide text-muted-foreground">
                              {assignee}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="h-auto px-0 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground hover:bg-transparent hover:text-foreground"
                      >
                        View <ChevronRightIcon className="size-3.5" />
                      </Button>
                    </footer>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
