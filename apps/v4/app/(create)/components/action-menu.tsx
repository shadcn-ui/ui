"use client"

import * as React from "react"
import Script from "next/script"
import { Button } from "@/examples/base/ui/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/examples/base/ui/combobox"
import { CheckIcon } from "lucide-react"
import { type RegistryItem } from "shadcn/schema"

import {
  BASE_COLORS,
  BASES,
  getThemesForBaseColor,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
} from "@/registry/config"
import { FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"
import { groupItemsByType } from "@/app/(create)/lib/utils"

export const CMD_K_FORWARD_TYPE = "cmd-k-forward"

type DesignSystemSearchParams = ReturnType<
  typeof useDesignSystemSearchParams
>[0]

type DesignSystemParamKey =
  | "style"
  | "baseColor"
  | "theme"
  | "iconLibrary"
  | "font"
  | "radius"
  | "menuColor"
  | "menuAccent"
  | "base"

type RegistryActionMenuItem = {
  id: string
  type: string
  label: string
  registryName: string
}

type DesignSystemActionMenuItem = {
  id: string
  type: string
  label: string
  paramKey: DesignSystemParamKey
  paramValue: string
}

type ActionMenuItem = RegistryActionMenuItem | DesignSystemActionMenuItem

type ActionMenuGroup = {
  type: string
  title: string
  items: ActionMenuItem[]
}

const cachedGroupedItems = React.cache(
  (items: Pick<RegistryItem, "name" | "title" | "type">[]) => {
    return groupItemsByType(items)
  }
)

const comboboxTriggerButton = (
  <Button
    variant="outline"
    aria-label="Select item"
    className="h-[calc(--spacing(13.5))] w-full flex-1 touch-manipulation justify-between gap-2 rounded-xl border-foreground/10 bg-muted/50 pr-4! pl-2.5 text-left shadow-none select-none data-popup-open:bg-muted *:data-[slot=combobox-trigger-icon]:hidden sm:h-8 sm:rounded-lg sm:bg-background sm:pr-2! dark:bg-muted/50 dark:data-popup-open:bg-muted/50 md:dark:bg-background"
  />
)

// Hoisted static element. (rendering-hoist-jsx)
const comboboxEmpty = <ComboboxEmpty>No items found.</ComboboxEmpty>

function createDesignSystemGroup<T>(config: {
  paramKey: DesignSystemParamKey
  title: string
  items: readonly T[]
  getValue: (item: T) => string
  getLabel: (item: T) => string
}): ActionMenuGroup {
  return {
    type: `ds:${config.paramKey}`,
    title: config.title,
    items: config.items.map((item) => ({
      id: `${config.paramKey}:${config.getValue(item)}`,
      type: `ds:${config.paramKey}`,
      label: config.getLabel(item),
      paramKey: config.paramKey,
      paramValue: config.getValue(item),
    })),
  }
}

const SEARCH_KEYWORDS: Record<string, string> = {
  "ds:font": "font fonts typography",
  "ds:radius": "radius rad rounded corner",
  "ds:style": "style theme preset",
  "ds:baseColor": "base color colours colors",
  "ds:theme": "theme appearance mode",
  "ds:iconLibrary": "icon library icons",
  "ds:menuColor": "menu color colors",
  "ds:menuAccent": "menu accent",
  "ds:base": "component library base",
  "registry:block": "block blocks component components",
  "registry:item": "item items component components",
}

export function ActionMenu({
  itemsByBase,
}: {
  itemsByBase: Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
}) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useDesignSystemSearchParams()

  const items = React.useMemo(
    () => itemsByBase?.[params.base] ?? [],
    [itemsByBase, params.base]
  )

  const groupedRegistryItems = React.useMemo(
    () => cachedGroupedItems(items),
    [items]
  )

  const groups = React.useMemo(() => {
    const sortedRegistryGroups = [...groupedRegistryItems].sort((a, b) => {
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

    const registryGroups: ActionMenuGroup[] = sortedRegistryGroups.map(
      (group) => ({
        type: group.type,
        title: group.title,
        items: group.items.map((item) => ({
          id: `${group.type}:${item.name}`,
          type: group.type,
          label: item.title ?? item.name,
          registryName: item.name,
        })),
      })
    )

    return [
      ...registryGroups,
      createDesignSystemGroup({
        paramKey: "style",
        title: "Style",
        items: STYLES,
        getValue: (s) => s.name,
        getLabel: (s) => s.title,
      }),
      createDesignSystemGroup({
        paramKey: "baseColor",
        title: "Base Color",
        items: BASE_COLORS,
        getValue: (c) => c.name,
        getLabel: (c) => c.title ?? c.name,
      }),
      createDesignSystemGroup({
        paramKey: "theme",
        title: "Theme",
        items: getThemesForBaseColor(params.baseColor),
        getValue: (t) => t.name,
        getLabel: (t) => t.title ?? t.name,
      }),
      createDesignSystemGroup({
        paramKey: "iconLibrary",
        title: "Icon Library",
        items: Object.values(iconLibraries),
        getValue: (lib) => lib.name,
        getLabel: (lib) => lib.title,
      }),
      createDesignSystemGroup({
        paramKey: "font",
        title: "Font",
        items: FONTS,
        getValue: (f) => f.value,
        getLabel: (f) => f.name,
      }),
      createDesignSystemGroup({
        paramKey: "radius",
        title: "Radius",
        items: RADII,
        getValue: (r) => r.name,
        getLabel: (r) => r.label,
      }),
      createDesignSystemGroup({
        paramKey: "menuColor",
        title: "Menu Color",
        items: MENU_COLORS,
        getValue: (m) => m.value,
        getLabel: (m) => m.label,
      }),
      createDesignSystemGroup({
        paramKey: "menuAccent",
        title: "Menu Accent",
        items: MENU_ACCENTS,
        getValue: (a) => a.value,
        getLabel: (a) => a.label,
      }),
      createDesignSystemGroup({
        paramKey: "base",
        title: "Component Library",
        items: BASES,
        getValue: (b) => b.name,
        getLabel: (b) => b.title ?? b.name,
      }),
    ]
  }, [groupedRegistryItems, params.baseColor])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "p") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleValueChange = React.useCallback(
    (item: ActionMenuItem | null) => {
      if (!item || !open) {
        return
      }
      if ("registryName" in item) {
        setParams({ item: item.registryName })
      } else {
        setParams({
          [item.paramKey]: item.paramValue,
        } as Partial<DesignSystemSearchParams>)
      }
      setOpen(false)
    },
    [setParams, open]
  )

  const isItemActive = React.useCallback(
    (item: ActionMenuItem) => {
      if ("registryName" in item) {
        return params.item === item.registryName
      }
      return params[item.paramKey] === item.paramValue
    },
    [params]
  )

  const handleBackdropClick = React.useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Combobox
      autoHighlight
      items={groups}
      value={null}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={setOpen}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
    >
      <ComboboxTrigger render={comboboxTriggerButton}>
        <ComboboxValue>
          <span className="flex-1 text-sm text-muted-foreground">
            Quick actions...
          </span>
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent
        className="w-80 animate-none data-open:animate-none"
        side="right"
        align="start"
      >
        <ComboboxInput
          showTrigger={false}
          placeholder="Search"
          className="has-focus-visible:border-inherit! has-focus-visible:ring-0!"
        />
        {comboboxEmpty}
        <ComboboxList className="max-h-128">
          {(group: ActionMenuGroup) => (
            <ComboboxGroup key={group.type} items={group.items}>
              <ComboboxLabel>{group.title}</ComboboxLabel>
              <ComboboxCollection>
                {(item: ActionMenuItem) => (
                  <ComboboxItem key={item.id} value={item} className="px-2">
                    {item.label}
                    {isItemActive(item) ? (
                      <CheckIcon className="absolute top-1/2 right-2 -translate-y-1/2" />
                    ) : null}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
      <div
        data-open={open}
        className="fixed inset-0 z-50 hidden bg-transparent data-[open=true]:block"
        onClick={handleBackdropClick}
      />
    </Combobox>
  )
}

// Hoisted outside the component — stable reference, never re-created. (rendering-hoist-jsx)
function itemToStringValue(item: ActionMenuItem | null) {
  if (!item) {
    return ""
  }
  if ("items" in item) {
    return (item as unknown as ActionMenuGroup).title ?? ""
  }
  return item.label ?? ""
}

function itemToStringLabel(item: ActionMenuItem | null) {
  if (!item) {
    return ""
  }
  if ("items" in item) {
    return (item as unknown as ActionMenuGroup).title ?? ""
  }
  return `${item.label ?? ""} ${getSearchKeywordsForType(item.type)}`.trim()
}

function getSearchKeywordsForType(type: string) {
  return SEARCH_KEYWORDS[type] ?? type.replace(":", " ")
}

export function ActionMenuScript() {
  return (
    <Script
      id="design-system-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward Cmd/Ctrl + K and Cmd/Ctrl + P
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'k' || e.key === 'p') && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${CMD_K_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}
