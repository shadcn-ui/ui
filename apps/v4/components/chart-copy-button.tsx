"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { trackEvent, type Event } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export function ChartCopyButton({
  event,
  name,
  code,
  className,
  ...props
}: {
  event: Event["name"]
  name: string
  code: string
} & React.ComponentProps<typeof Button>) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyToClipboard = async (text: string) => {
    try {
      // Try using the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand("copy")
          textArea.remove()
        } catch (err) {
          console.error("Fallback: Could not copy text", err)
          textArea.remove()
          throw err
        }
      }

      trackEvent({
        name: event,
        properties: {
          name,
        },
      })
      setHasCopied(true)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "[&_svg]-h-3.5 h-7 w-7 rounded-[6px] [&_svg]:w-3.5",
            className
          )}
          onClick={() => copyToClipboard(code)}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <IconCheck /> : <IconCopy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">Copy code</TooltipContent>
    </Tooltip>
  )
}
