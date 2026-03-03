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

  const url = React.useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_APP_URL}/create/v0?base=${params.base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}&item=${params.item}`,
    [
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
    ]
  )

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
          href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${encodeURIComponent(url)}&title=${params.item}`}
          target="_blank"
        />
      }
    >
      <span>Open in</span>
      <Icons.v0 className="size-5" data-icon="inline-end" />
    </Button>
  )
}
