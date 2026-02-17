"use client"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useMounted } from "@/hooks/use-mounted"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function V0Button({ className }: { className?: string }) {
  const [params] = useDesignSystemSearchParams()
  const isMobile = useIsMobile()
  const isMounted = useMounted()

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/create/v0?base=${params.base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}&item=${params.item}`

  if (!isMounted) {
    return <Skeleton className="h-8 w-24 rounded-lg" />
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={isMobile ? "default" : "outline"}
            className={cn(
              "w-24 rounded-lg shadow-none data-[variant=default]:h-[31px] lg:w-8 xl:w-24",
              className
            )}
            asChild
          >
            <a
              href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${encodeURIComponent(url)}&title=${params.item}`}
              target="_blank"
            >
              <span className="lg:hidden xl:block">Open in</span>
              <Icons.v0 className="size-5" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open current design in v0</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
