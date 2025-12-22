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
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  /**
   * Copies text to clipboard using the modern Clipboard API with fallback support.
  
   * Modern approach (preferred):
   * - Uses `navigator.clipboard.writeText()` which is async and secure
   * - Only available in secure contexts (HTTPS, localhost, or file://)
   * - Supported in all modern browsers (Chrome 63+, Firefox 53+, Safari 13.1+, Edge 79+)
   
   * Fallback approach (legacy):
   * - Uses `document.execCommand('copy')` for older browsers
   * - Works in non-secure contexts (HTTP)
   * - Note: This method is deprecated and may be removed in future browser versions
   * - Used as a best-effort compatibility layer for legacy environments
   * - Required for: IE 11, older Android browsers, and HTTP-served pages
   */
  const copyToClipboard = React.useCallback(
    async (text: string) => {
      try {
        // Prefer the modern async clipboard API when available in secure contexts (HTTPS)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
        } else {
          // Fallback for older browsers or non-secure contexts (e.g., HTTP, some iframes)
          // This path handles:
          // 1. Older browsers that don't support navigator. clipboard
          // 2. Non-secure contexts (HTTP instead of HTTPS)
          // 3. Browsers with clipboard API disabled
          const textArea = document.createElement("textarea")
          textArea.value = text
          // Position off-screen to avoid visual flash
          textArea.style.position = "fixed"
          textArea.style. left = "-999999px"
          textArea.style.top = "-999999px"
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          try {
            // Note: execCommand is deprecated but remains the only option for non-secure contexts
            document.execCommand("copy")
            textArea.remove()
          } catch (err) {
            console.error("Fallback: Could not copy text", err)
            textArea.remove()
            throw err
          }
        }

        trackEvent({
          name:  event,
          properties: {
            name,
          },
        })
        setHasCopied(true)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    },
    [event, name]
  )

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