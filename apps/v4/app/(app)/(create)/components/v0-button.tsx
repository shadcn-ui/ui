"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useMounted } from "@/hooks/use-mounted"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/styles/base-nova/ui/button"
import { Skeleton } from "@/styles/base-nova/ui/skeleton"
import { useDesignSystemSearchParams } from "@/app/(app)/(create)/lib/search-params"

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

    return `${process.env.NEXT_PUBLIC_APP_URL}/init/v0?${searchParams.toString()}`
  }, [params.preset, params.base])

  const title = React.useMemo(() => {
    return params.base && params.style
      ? `New ${params.base}-${params.style} project`
      : "New Project"
  }, [params.base, params.style])

  if (!isMounted) {
    return <Skeleton className="h-8 w-24 rounded-lg" />
  }

  return (
    <a
      href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${url}&title=${title}`}
      target="_blank"
      className={cn(
        buttonVariants({ variant: isMobile ? "default" : "outline" }),
        "h-[31px] gap-1 rounded-lg",
        className
      )}
    >
      <span>Open in</span>
      <Icons.v0 className="size-5" data-icon="inline-end" />
    </a>
  )
}
