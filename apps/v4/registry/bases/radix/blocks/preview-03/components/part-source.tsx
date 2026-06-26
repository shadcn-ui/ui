"use client"

import * as React from "react"
import { type SourceDocumentUIPart, type SourceUrlUIPart } from "ai"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { IconPlaceholder } from "@/app/(app)/create/components/icon-placeholder"

type SourcePart = SourceDocumentUIPart | SourceUrlUIPart

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function PartSource({
  part,
  className,
}: { part: SourcePart } & Omit<React.ComponentProps<"div">, "part">) {
  if (part.type === "source-url") {
    return (
      <a
        data-slot="part-source"
        data-type={part.type}
        href={part.url}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex w-full max-w-full min-w-0 items-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm transition-colors hover:bg-muted",
          className
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
          <IconPlaceholder
            lucide="ExternalLinkIcon"
            tabler="IconExternalLink"
            hugeicons="LinkSquare02Icon"
            phosphor="ArrowSquareOutIcon"
            remixicon="RiExternalLinkLine"
            className="size-4"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">
            {part.title ?? part.url}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {getHostname(part.url)}
          </span>
        </span>
        <Badge variant="outline" className="shrink-0">
          URL
        </Badge>
      </a>
    )
  }

  if (part.type === "source-document") {
    return (
      <div
        data-slot="part-source"
        data-type={part.type}
        className={cn(
          "flex w-full max-w-full min-w-0 items-start gap-2 rounded-lg border bg-muted/40 p-3 text-sm",
          className
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
          <IconPlaceholder
            lucide="FileSearchIcon"
            tabler="IconFileSearch"
            hugeicons="FileSearchIcon"
            phosphor="FileSearchIcon"
            remixicon="RiFileSearchLine"
            className="size-4"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">
            {part.title ?? part.filename ?? "Document source"}
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {[part.filename, part.mediaType].filter(Boolean).join(" / ")}
          </span>
          <span className="mt-2 block text-xs text-muted-foreground">
            Source ID: {part.sourceId}
          </span>
        </span>
        <Badge variant="outline" className="shrink-0">
          Document
        </Badge>
      </div>
    )
  }

  return null
}
