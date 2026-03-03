"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"

import { cn } from "@/lib/utils"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"

export function CopyPreset({ className }: React.ComponentProps<typeof Button>) {
  const presetCode = usePresetCode()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    copyToClipboardWithMeta(`--preset ${presetCode}`, {
      name: "copy_preset_command",
      properties: {
        preset: presetCode,
      },
    })
    setHasCopied(true)
  }, [presetCode])

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className={cn(
        "font-mono text-[0.825rem] transition-none pointer-coarse:h-10! pointer-coarse:text-sm!",
        className
      )}
    >
      <span>{hasCopied ? "Copied" : `--preset ${presetCode}`}</span>
    </Button>
  )
}
