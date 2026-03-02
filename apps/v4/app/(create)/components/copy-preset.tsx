"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { copyToClipboardWithMeta } from "@/components/copy-button"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"

export function CopyPreset() {
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
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="group/button"
    >
      --preset {presetCode}
      <HugeiconsIcon
        icon={hasCopied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
        className="opacity-0 group-hover/button:opacity-100"
        data-icon="inline-end"
      />
    </Button>
  )
}
