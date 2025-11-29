"use client"

import * as React from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { type RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function ItemNav({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const currentIndex = React.useMemo(() => {
    return items.findIndex((item) => item.name === params.item)
  }, [items, params.item])

  const currentItem = React.useMemo(() => {
    return items[currentIndex] ?? null
  }, [items, currentIndex])

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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-lg"
        onClick={handlePrev}
        disabled={!prevItem}
      >
        <IconArrowLeft />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-lg"
        onClick={handleNext}
        disabled={!nextItem}
      >
        <IconArrowRight />
      </Button>
    </div>
  )
}
