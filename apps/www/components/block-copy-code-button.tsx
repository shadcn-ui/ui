"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "@radix-ui/react-icons"

import { trackEvent } from "@/lib/events"
import { Button } from "@/registry/new-york/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export function BlockCopyCodeButton({
  name,
  code,
}: {
  name: string
  code: string
}) {
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
          className="h-7 w-7 [&_svg]:size-3.5"
          onClick={() => {
            navigator.clipboard.writeText(code)
            trackEvent({
              name: "copy_block_code",
              properties: {
                name,
              },
            })
            setHasCopied(true)
          }}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy code</TooltipContent>
    </Tooltip>
  )
}
