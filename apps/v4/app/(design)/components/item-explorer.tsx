"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"
import { groupItemsByType } from "@/app/(design)/lib/utils"

const cachedGroupedItems = React.cache(
  (items: Pick<RegistryItem, "name" | "title" | "type">[]) => {
    return groupItemsByType(items)
  }
)

export function ItemExplorer({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const groupedItems = React.useMemo(() => cachedGroupedItems(items), [items])

  const currentItem = React.useMemo(
    () => items.find((item) => item.name === params.item) ?? null,
    [items, params.item]
  )

  return (
    <div className="flex flex-1 flex-col gap-px p-2">
      {groupedItems.map((group) => (
        <div key={group.type} className="flex flex-col gap-px">
          <h3 className="text-muted-foreground text-sm font-medium">
            {group.title}
          </h3>
          {group.items.map((item) => (
            <Button
              size="sm"
              key={item.name}
              variant="ghost"
              onClick={() => setParams({ item: item.name })}
              className="justify-start font-normal data-[active=true]:font-medium"
              data-active={item.name === currentItem?.name}
            >
              {item.title}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}
