"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import { designSystemSearchParams } from "@/app/(design)/design/lib/search-params"

export function ItemExplorer({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title">[]
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const currentItem = React.useMemo(
    () => items.find((item) => item.name === params.item) ?? null,
    [items, params.item]
  )

  return (
    <div className="flex flex-1 flex-col gap-px p-2">
      {items.map((item) => (
        <Button
          size="sm"
          key={item.name}
          variant={item.name === currentItem?.name ? "secondary" : "ghost"}
          onClick={() => setParams({ item: item.name })}
          className="justify-start font-normal data-[active=true]:font-medium"
          data-active={item.name === currentItem?.name}
        >
          {item.title}
        </Button>
      ))}
    </div>
  )
}
