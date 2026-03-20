"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"

import { cn } from "@/lib/utils"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"
import { buildPresetArgs } from "@/app/(create)/lib/preset-links"

export function CopyPreset({ className }: React.ComponentProps<typeof Button>) {
  const [params] = useDesignSystemSearchParams()
  const presetCode = usePresetCode()
  const presetArgs = React.useMemo(
    () => buildPresetArgs(presetCode, { base: params.base }),
    [params.base, presetCode]
  )
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    copyToClipboardWithMeta(presetArgs, {
      name: "copy_preset_command",
      properties: {
        preset: presetCode,
      },
    })
    setHasCopied(true)
  }, [presetArgs, presetCode])

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className={cn(
        "touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10!",
        className
      )}
    >
      <span>{hasCopied ? "Copied" : presetArgs}</span>
    </Button>
  )
}
