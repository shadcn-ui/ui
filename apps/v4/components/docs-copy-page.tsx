"use client"

import { IconCheck, IconCopy } from "@tabler/icons-react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/new-york-v4/ui/button"

export function DocsCopyPage({ page }: { page: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8 shadow-none md:h-7 md:text-[0.8rem]"
      onClick={() => copyToClipboard(page)}
    >
      {isCopied ? <IconCheck /> : <IconCopy />}
      Copy Page
    </Button>
  )
}
