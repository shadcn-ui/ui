"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import { Event, trackEvent } from "@/lib/events"
import { Button, ButtonProps } from "@/registry/new-york/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export function BlockCopyButton({
  event,
  name,
  code,
  ...props
}: {
  event: Event["name"]
  name: string
  code: string
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7 rounded-[6px] [&_svg]:size-3.5"
          onClick={() => {
            navigator.clipboard.writeText(code)
            trackEvent({
              name: event,
              properties: {
                name,
              },
            })
            setHasCopied(true)
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy code</TooltipContent>
    </Tooltip>
  )
}
