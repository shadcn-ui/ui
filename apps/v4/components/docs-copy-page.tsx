"use client"

import { IconCheck, IconCopy } from "@tabler/icons-react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export function DocsCopyPage({ page }: { page: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 pl-1.5 md:h-7 [&>svg]:size-3.5"
          onClick={() => copyToClipboard(page)}
        >
          {isCopied ? <IconCheck /> : <IconCopy />} Copy Page
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy as Markdown</p>
      </TooltipContent>
    </Tooltip>
  )
}
