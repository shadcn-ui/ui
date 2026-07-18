"use client"

import * as React from "react"
import { type FileUIPart } from "ai"

import { cn } from "@/registry/bases/radix/lib/utils"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/registry/bases/radix/ui/attachment"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { IconPlaceholder } from "@/app/(app)/create/components/icon-placeholder"

function getFilename(part: FileUIPart) {
  if (part.filename) {
    return part.filename
  }

  try {
    const pathname = new URL(part.url).pathname
    const filename = pathname.split("/").filter(Boolean).pop()

    if (filename?.includes(".")) {
      return decodeURIComponent(filename)
    }
  } catch {
    const filename = part.url.split("?")[0]?.split("/").pop()

    if (filename?.includes(".")) {
      return filename
    }
  }

  return part.mediaType.startsWith("image/") ? "Image file" : "File"
}

export function PartFile({
  part,
  className,
}: { part: FileUIPart } & Omit<React.ComponentProps<"div">, "part">) {
  if (part.type !== "file") {
    return null
  }

  const isImage = part.mediaType.startsWith("image/")
  const filename = getFilename(part)

  if (isImage) {
    return (
      <Attachment
        orientation="vertical"
        className={cn("group/file w-full max-w-72", className)}
      >
        <AttachmentMedia variant="image" className="aspect-[4/3] w-full">
          <img src={part.url} alt={filename} />
        </AttachmentMedia>
        <AttachmentContent className="flex items-center gap-2">
          <AttachmentMedia className="size-7">
            <IconPlaceholder
              lucide="ImageIcon"
              tabler="IconPhoto"
              hugeicons="ImageIcon"
              phosphor="ImageIcon"
              remixicon="RiImageLine"
            />
          </AttachmentMedia>
          <span className="min-w-0 flex-1">
            <AttachmentTitle>{filename}</AttachmentTitle>
          </span>
          <Badge variant="outline" className="shrink-0">
            {part.mediaType.replace("image/", "").toUpperCase()}
          </Badge>
        </AttachmentContent>
        <AttachmentTrigger asChild>
          <a
            href={part.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${filename}`}
          />
        </AttachmentTrigger>
      </Attachment>
    )
  }

  return (
    <Attachment className={cn("w-full max-w-80", className)}>
      <AttachmentMedia>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="FileIcon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{filename}</AttachmentTitle>
        <AttachmentDescription>{part.mediaType}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction asChild aria-hidden="true">
          <span>
            <IconPlaceholder
              lucide="ExternalLinkIcon"
              tabler="IconExternalLink"
              hugeicons="LinkSquare02Icon"
              phosphor="ArrowSquareOutIcon"
              remixicon="RiExternalLinkLine"
            />
          </span>
        </AttachmentAction>
      </AttachmentActions>
      <AttachmentTrigger asChild>
        <a
          href={part.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${filename}`}
        />
      </AttachmentTrigger>
    </Attachment>
  )
}
