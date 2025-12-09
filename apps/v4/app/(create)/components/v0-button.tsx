"use client"

import { useQueryStates } from "nuqs"

import { useIsMobile } from "@/hooks/use-mobile"
import { useMounted } from "@/hooks/use-mounted"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function V0Button() {
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })
  const isMobile = useIsMobile()
  const isMounted = useMounted()

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/create/v0?base=${params.base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}&item=${params.item}`

  if (!isMounted) {
    return <Skeleton className="h-8 w-24 rounded-lg" />
  }

  return (
    <>
      <Button
        size="sm"
        variant={isMobile ? "default" : "outline"}
        className="w-24 rounded-lg shadow-none data-[variant=default]:h-[31px]"
        asChild
      >
        <a
          href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${url}`}
          target="_blank"
        >
          Open in <Icons.v0 className="size-5" />
        </a>
      </Button>
    </>
  )
}
