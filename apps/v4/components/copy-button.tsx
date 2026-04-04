"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { trackEvent, type Event } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

function legacyCopyToClipboard(value: string) {
  const textArea = document.createElement("textarea")
  textArea.value = value
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.opacity = "0"
  textArea.style.pointerEvents = "none"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  textArea.setSelectionRange(0, value.length)

  let hasCopied = false
  try {
    hasCopied = document.execCommand("copy")
  } catch {
    hasCopied = false
  }

  document.body.removeChild(textArea)
  return hasCopied
}

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  if (typeof window === "undefined") {
    return false
  }

  if (!value) {
    return false
  }

  let hasCopied = false

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      hasCopied = true
    } catch {
      hasCopied = legacyCopyToClipboard(value)
    }
  } else {
    hasCopied = legacyCopyToClipboard(value)
  }

  if (!hasCopied) {
    return false
  }

  if (event) {
    trackEvent(event)
  }

  return true
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  event,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string
  src?: string
  event?: Event["name"]
  tooltip?: string
}) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  return (
    <Button
      data-slot="copy-button"
      data-copied={hasCopied}
      size="icon"
      variant={variant}
      className={cn(
        "absolute top-3 right-2 z-10 h-7 bg-code text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 hover:opacity-100 focus-visible:opacity-100",
        hasCopied ? "w-auto px-2" : "w-7 px-0",
        className
      )}
      onClick={async () => {
        const hasCopied = await copyToClipboardWithMeta(
          value,
          event
            ? {
                name: event,
                properties: {
                  code: value,
                },
              }
            : undefined
        )

        if (hasCopied) {
          setHasCopied(true)
        }
      }}
      {...props}
    >
      {hasCopied ? (
        <span className="flex items-center gap-1.5 text-xs">
          <IconCheck stroke={2} className="size-3.5" />
          Copied!
        </span>
      ) : (
        <>
          <span className="sr-only">Copy</span>
          <IconCopy stroke={2} className="size-3.5" />
        </>
      )}
    </Button>
  )
}
