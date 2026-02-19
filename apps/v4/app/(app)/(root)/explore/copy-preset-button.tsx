"use client"

import * as React from "react"

import { Badge } from "@/examples/radix/ui/badge"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function CopyPresetButton({ code }: { code: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const presetValue = `--preset ${code}`

  return (
    <Badge
      asChild
      className="cursor-pointer"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          copyToClipboard(presetValue)
        }}
        title={`Copy ${presetValue}`}
        aria-label={isCopied ? "Copied to clipboard" : `Copy ${presetValue}`}
      >
        {isCopied ? "Copied!" : presetValue}
      </button>
    </Badge>
  )
}
