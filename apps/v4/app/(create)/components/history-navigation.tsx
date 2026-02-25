"use client"

import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { useHistory } from "@/app/(create)/hooks/use-history"

export function HistoryNavigation() {
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()

  return (
    <div className="hidden items-center gap-1 sm:flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon-sm"
            className="rounded-lg"
            disabled={!canGoBack}
            onClick={goBack}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
            <span className="sr-only">Undo</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon-sm"
            className="rounded-lg"
            disabled={!canGoForward}
            onClick={goForward}
          >
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
            <span className="sr-only">Redo</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </div>
  )
}
