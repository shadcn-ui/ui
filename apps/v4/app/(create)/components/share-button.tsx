"use client"

import * as React from "react"
import { Share03Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ShareButton() {
  const [params] = useDesignSystemSearchParams()
  const [hasCopied, setHasCopied] = React.useState(false)

  const shareUrl = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${origin}/create?base=${params.base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}&item=${params.item}`
  }, [
    params.base,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.menuAccent,
    params.menuColor,
    params.radius,
    params.item,
  ])

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    copyToClipboardWithMeta(shareUrl, {
      name: "copy_create_share_url",
      properties: {
        url: shareUrl,
      },
    })
    setHasCopied(true)
  }, [shareUrl])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-lg shadow-none lg:w-8 xl:w-fit"
          onClick={handleCopy}
        >
          {hasCopied ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          ) : (
            <HugeiconsIcon icon={Share03Icon} strokeWidth={2} />
          )}
          <span className="lg:hidden xl:block">Share</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy Link</TooltipContent>
    </Tooltip>
  )
}
