"use client"

import * as React from "react"
import { AlertCircleIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/styles/base-sera/ui/badge"
import { Button } from "@/styles/base-sera/ui/button"
import {
  Progress,
  ProgressTrack,
  ProgressValue,
} from "@/styles/base-sera/ui/progress"
import { Separator } from "@/styles/base-sera/ui/separator"

type IssueStatus = "active" | "draft" | "archived"
type IssueHealth = "overdue" | "on-track" | "completed"

type PublicationIssue = {
  name: string
  dueLabel: string
  status: IssueStatus
  progress: number
  health: IssueHealth
  healthLabel: string
  primaryAction: string
  secondaryAction?: string
  disabled?: boolean
}

const PUBLICATION_ISSUES: PublicationIssue[] = [
  {
    name: "Summer Issue",
    dueLabel: "Due Aug 15, 2024",
    status: "active",
    progress: 45,
    health: "overdue",
    healthLabel: "1 block overdue",
    primaryAction: "View Board",
    secondaryAction: "Manage",
  },
  {
    name: "Autumn Issue",
    dueLabel: "Due Nov 01, 2024",
    status: "draft",
    progress: 10,
    health: "on-track",
    healthLabel: "On track",
    primaryAction: "Resume Draft",
    secondaryAction: "Manage",
  },
  {
    name: "Spring Issue",
    dueLabel: "Published May 10, 2024",
    status: "archived",
    progress: 100,
    health: "completed",
    healthLabel: "Completed",
    primaryAction: "View Archive",
    disabled: true,
  },
]

function getStatusVariant(
  status: IssueStatus
): React.ComponentProps<typeof Badge>["variant"] {
  if (status === "active") {
    return "outline"
  }

  if (status === "draft") {
    return "secondary"
  }

  return "ghost"
}

function getHealthStyles(health: IssueHealth): {
  icon: React.JSX.Element
  className: string
} {
  if (health === "overdue") {
    return {
      icon: <AlertCircleIcon className="size-3.5" />,
      className: "text-foreground",
    }
  }

  return {
    icon: <CheckIcon className="size-3.5" />,
    className: "text-muted-foreground",
  }
}

export function PublicationIssues() {
  return (
    <section className="flex flex-col gap-6 border border-border/70 bg-background p-6 md:p-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-5xl leading-none tracking-tight uppercase">
            Publication Issues
          </h2>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Editorial Pipeline Management
          </p>
        </div>
        <Button className="h-10 w-full px-5 text-[10px] font-semibold tracking-[0.2em] lg:w-auto">
          Create New Issue
        </Button>
      </header>

      <Separator />

      <div className="flex flex-col gap-4">
        {PUBLICATION_ISSUES.map((issue) => {
          const statusVariant = getStatusVariant(issue.status)
          const healthStyles = getHealthStyles(issue.health)

          return (
            <article
              key={issue.name}
              className="grid grid-cols-1 gap-5 border border-border/60 bg-card px-5 py-6 md:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)_auto] md:items-center md:gap-6 md:px-7"
            >
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-4xl leading-none tracking-tight">
                    {issue.name}
                  </h3>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {issue.dueLabel}
                  </p>
                </div>
                <Badge
                  variant={statusVariant}
                  className="w-fit px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase"
                >
                  {issue.status}
                </Badge>
              </div>

              <div className="flex flex-col gap-3 border-l-0 border-border/60 md:border-l md:pl-6">
                <Progress value={issue.progress} className="gap-2">
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      Editorial Progress
                    </span>
                    <ProgressValue className="m-0 text-[11px] font-semibold text-foreground">
                      {(value) => `${value}%`}
                    </ProgressValue>
                  </div>
                  <ProgressTrack className="bg-border/90" />
                </Progress>
                <div
                  className={cn(
                    "flex items-center gap-2 text-[12px] font-medium",
                    healthStyles.className
                  )}
                >
                  {healthStyles.icon}
                  <span>{issue.healthLabel}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-2 border-l-0 border-border/60 md:justify-end md:border-l md:pl-6">
                {issue.secondaryAction ? (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={issue.disabled}
                    className="h-9 px-4 text-[10px] font-semibold tracking-[0.16em]"
                  >
                    {issue.secondaryAction}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant={issue.status === "active" ? "default" : "outline"}
                  disabled={issue.disabled}
                  className="h-9 px-4 text-[10px] font-semibold tracking-[0.16em]"
                >
                  {issue.primaryAction}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
