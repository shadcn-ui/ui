"use client"

import * as React from "react"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Separator } from "@/registry/bases/radix/ui/separator"
import { IconPlaceholder } from "@/app/(app)/create/components/icon-placeholder"

type ToolPart = {
  type: `tool-${string}` | "dynamic-tool"
  toolName?: string
  toolCallId: string
  title?: string
  state: string
  input?: unknown
  output?: unknown
  errorText?: string
}

function getToolName(part: ToolPart) {
  return part.type === "dynamic-tool"
    ? (part.toolName ?? "dynamicTool")
    : part.type.replace("tool-", "")
}

function getToolTitle(part: ToolPart) {
  if ("title" in part && typeof part.title === "string") {
    return part.title
  }

  return getToolName(part)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatValue(value: unknown) {
  if (typeof value === "string") {
    return value
  }

  return JSON.stringify(value, null, 2)
}

export function PartTool({
  part,
  className,
}: { part: ToolPart } & Omit<React.ComponentProps<"div">, "part">) {
  if (part.type !== "dynamic-tool" && !part.type.startsWith("tool-")) {
    return null
  }

  const input = "input" in part ? part.input : undefined
  const output = "output" in part ? part.output : undefined
  const errorText = "errorText" in part ? part.errorText : undefined
  const stateLabel = part.state.replace(/-/g, " ")

  return (
    <div
      data-slot="part-tool"
      data-state={part.state}
      className={cn(
        "w-full max-w-full min-w-0 rounded-lg border bg-muted/40 text-sm",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2 px-3 py-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
          <IconPlaceholder
            lucide="SettingsIcon"
            tabler="IconSettings"
            hugeicons="SettingsIcon"
            phosphor="TerminalIcon"
            remixicon="RiSettingsLine"
            className="size-4"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{getToolTitle(part)}</div>
          <div className="truncate text-xs text-muted-foreground">
            {getToolName(part)}
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {stateLabel}
        </Badge>
      </div>
      {input !== undefined || output !== undefined || errorText ? (
        <>
          <Separator />
          <div className="grid gap-3 p-3">
            {input !== undefined ? (
              <div className="grid gap-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Input
                </div>
                <pre className="max-h-32 overflow-auto rounded-md bg-background p-2 text-xs leading-relaxed">
                  {formatValue(input)}
                </pre>
              </div>
            ) : null}
            {output !== undefined ? (
              <div className="grid gap-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Output
                </div>
                <pre className="max-h-40 overflow-auto rounded-md bg-background p-2 text-xs leading-relaxed">
                  {formatValue(output)}
                </pre>
              </div>
            ) : null}
            {errorText ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
                {errorText}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}
