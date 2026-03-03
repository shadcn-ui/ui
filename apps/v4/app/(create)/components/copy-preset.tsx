"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
        "justify-between font-mono text-xs transition-none",
        className
      )}
    >
      <span>--preset {presetCode}</span>
      <HugeiconsIcon
        icon={hasCopied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
        data-icon="inline-end"
        className="size-3"
      />
    </Button>
  )
}
