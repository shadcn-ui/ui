"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import { Share03Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { copyToClipboardWithMeta } from "@/components/copy-button"
import { usePresetCode } from "@/app/(create)/hooks/use-design-system"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ShareButton() {
  const [params] = useDesignSystemSearchParams()
  const presetCode = usePresetCode()
  const [hasCopied, setHasCopied] = React.useState(false)

  const shareUrl = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${origin}/create?preset=${presetCode}&item=${params.item}`
  }, [presetCode, params.item])

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
    <Button variant="outline" className="hidden md:flex" onClick={handleCopy}>
      {hasCopied ? (
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
      ) : (
        <HugeiconsIcon
          icon={Share03Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
      )}
      Share
    </Button>
  )
}
