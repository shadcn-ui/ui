"use client"

import {
  SquareLock01Icon,
  SquareUnlock01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { useLocks, type LockableParam } from "@/app/(create)/hooks/use-locks"

export function LockButton({
  param,
  className,
}: {
  param: LockableParam
  className?: string
}) {
  const { isLocked, toggleLock } = useLocks()
  const locked = isLocked(param)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => toggleLock(param)}
          data-locked={locked}
          className={cn(
            "flex size-4 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity group-focus-within/picker:opacity-100 group-hover/picker:opacity-100 focus:opacity-100 data-[locked=true]:opacity-100 pointer-coarse:hidden",
            className
          )}
          aria-label={locked ? "Unlock" : "Lock"}
        >
          <HugeiconsIcon
            icon={locked ? SquareLock01Icon : SquareUnlock01Icon}
            strokeWidth={2}
            className="text-foreground size-5"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>{locked ? "Unlock" : "Lock"}</TooltipContent>
    </Tooltip>
  )
}
