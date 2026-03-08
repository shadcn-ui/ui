"use client"

import * as React from "react"
import { type RegistryItem } from "shadcn/schema"
import useSWR from "swr"

import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"
import { groupItemsByType } from "@/app/(create)/lib/utils"

const ACTION_MENU_OPEN_KEY = "create:action-menu-open"

type ActionMenuItem = {
  id: string
  type: string
  label: string
  registryName: string
}

type ActionMenuGroup = {
  type: string
  title: string
  items: ActionMenuItem[]
}

type ActionMenuSourceItem = Pick<RegistryItem, "name" | "title" | "type">

const SEARCH_KEYWORDS: Record<string, string> = {
  "registry:block": "block blocks component components",
  "registry:item": "item items component components",
}

function sortRegistryGroups(groups: ReturnType<typeof groupItemsByType>) {
  return [...groups].sort((a, b) => {
    if (a.type === b.type) {
      return a.title.localeCompare(b.title)
    }
    if (a.type === "registry:block") {
      return -1
    }
    if (b.type === "registry:block") {
      return 1
    }
    return a.title.localeCompare(b.title)
  })
}

export function useActionMenu(
  itemsByBase: Record<string, ActionMenuSourceItem[]>
) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { data: open = false, mutate: setOpenData } = useSWR<boolean>(
    ACTION_MENU_OPEN_KEY,
    {
      fallbackData: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  const groups = React.useMemo<ActionMenuGroup[]>(() => {
    const currentBaseItems = itemsByBase?.[params.base] ?? []
    const sortedRegistryGroups = sortRegistryGroups(
      groupItemsByType(currentBaseItems)
    )

    return sortedRegistryGroups.map((group) => ({
      type: group.type,
      title: group.title,
      items: group.items.map((item) => ({
        id: `${group.type}:${item.name}`,
        type: group.type,
        label: item.title ?? item.name,
        registryName: item.name,
      })),
    }))
  }, [itemsByBase, params.base])

  const activeRegistryName = params.item

  const handleSelect = React.useCallback(
    (registryName: string) => {
      setParams({ item: registryName })
      void setOpenData(false, { revalidate: false })
    },
    [setOpenData, setParams]
  )

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      void setOpenData(nextOpen, { revalidate: false })
    },
    [setOpenData]
  )

  const getCommandValue = React.useCallback((item: ActionMenuItem) => {
    const keywords = SEARCH_KEYWORDS[item.type] ?? item.type.replace(":", " ")
    return `${item.label ?? ""} ${keywords}`.trim()
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        void setOpenData((currentOpen = false) => !currentOpen, {
          revalidate: false,
        })
      }
    }

    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [setOpenData])

  return {
    activeRegistryName,
    getCommandValue,
    groups,
    handleSelect,
    open,
    setOpen: handleOpenChange,
  }
}

export function useActionMenuTrigger() {
  const { mutate: setOpenData } = useSWR<boolean>(ACTION_MENU_OPEN_KEY, {
    fallbackData: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  })

  const openActionMenu = React.useCallback(() => {
    void setOpenData(true, { revalidate: false })
  }, [setOpenData])

  return {
    openActionMenu,
  }
}
