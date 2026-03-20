"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"

export function CopyPreset({
  className,
  collapsed = false,
}: React.ComponentProps<typeof Button> & {
  collapsed?: boolean
}) {
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

  const tooltipLabel = hasCopied
    ? "Copied preset"
    : `Copy --preset ${presetCode}`

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label={tooltipLabel}
              onClick={handleCopy}
              className={cn(
                "size-10 touch-manipulation rounded-xl bg-transparent! transition-none select-none hover:bg-muted!",
                className
              )}
            />
          }
        >
          <HugeiconsIcon
            icon={hasCopied ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
          />
          <span className="sr-only">{tooltipLabel}</span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className={cn(
        "touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10!",
        className
      )}
    >
      <span>{hasCopied ? "Copied" : `--preset ${presetCode}`}</span>
    </Button>
  )
}
