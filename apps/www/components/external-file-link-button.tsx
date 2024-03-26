"use client"

import * as React from "react"
import { ExternalLinkIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { Event, trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"

interface ExternalFileLinkButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  src?: string
  event?: Event["name"]
}

export function ExternalFileLinkButton({
  value,
  className,
  src,
  event,
  ...props
}: ExternalFileLinkButtonProps) {
  const redirectToExternalLink = React.useCallback(() => {
    const prefix = `${siteConfig.links.github}${siteConfig.demoCodeSlug}`
    if (event) {
      trackEvent({
        name: event,
        properties: {
          code: value,
        },
      })
    }
    window.open(prefix + src, "_blank")
  }, [src, value, event])
  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        className
      )}
      onClick={redirectToExternalLink}
      {...props}
    >
      <span className="sr-only">External Link</span>
      <ExternalLinkIcon className="h-3 w-3" />
    </Button>
  )
}
