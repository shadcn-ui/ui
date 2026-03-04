"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import { Skeleton } from "@/examples/base/ui/skeleton"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useMounted } from "@/hooks/use-mounted"
import { Icons } from "@/components/icons"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function V0Button({ className }: { className?: string }) {
  const [params] = useDesignSystemSearchParams()
  const isMobile = useIsMobile()
  const isMounted = useMounted()

  const url = React.useMemo(() => {
    const searchParams = new URLSearchParams()

    if (params.preset) {
      searchParams.set("preset", params.preset)
    }

    searchParams.set("base", params.base)

    if (params.item) {
      searchParams.set("item", params.item)
    }

    return `${process.env.NEXT_PUBLIC_APP_URL}/init/v0?${searchParams.toString()}`
  }, [params.preset, params.base, params.item])

  if (!isMounted) {
    return <Skeleton className="h-8 w-24 rounded-lg" />
  }

  return (
    <Button
      nativeButton={false}
      role="link"
      variant={isMobile ? "default" : "outline"}
      className={cn(
        "gap-1 pointer-coarse:h-10! pointer-coarse:text-sm!",
        className
      )}
      render={
        <a
          href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${url}`}
          target="_blank"
        />
      }
    >
      <span>Open in</span>
      <Icons.v0 className="size-5" data-icon="inline-end" />
    </Button>
  )
}
