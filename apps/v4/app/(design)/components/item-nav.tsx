"use client"

import * as React from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { type RegistryItem } from "shadcn/schema"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function ItemNav({
  items,
  className,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
  className?: string
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const currentIndex = React.useMemo(() => {
    return items.findIndex((item) => item.name === params.item)
  }, [items, params.item])

  const prevItem = React.useMemo(() => {
    if (currentIndex <= 0) {
      return null
    }
    return items[currentIndex - 1] ?? null
  }, [items, currentIndex])

  const nextItem = React.useMemo(() => {
    if (currentIndex < 0 || currentIndex >= items.length - 1) {
      return null
    }
    return items[currentIndex + 1] ?? null
  }, [items, currentIndex])

  const handlePrev = React.useCallback(() => {
    if (prevItem) {
      setParams({ item: prevItem.name })
    }
  }, [prevItem, setParams])

  const handleNext = React.useCallback(() => {
    if (nextItem) {
      setParams({ item: nextItem.name })
    }
  }, [nextItem, setParams])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handlePrev}
        disabled={!prevItem}
        className="rounded-lg shadow-none"
      >
        <IconArrowLeft />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleNext}
        disabled={!nextItem}
        className="rounded-lg shadow-none"
      >
        <IconArrowRight />
      </Button>
    </div>
  )
}
