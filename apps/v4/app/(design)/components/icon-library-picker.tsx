"use client"

import * as React from "react"
import { lazy, memo, Suspense } from "react"
import { useQueryStates } from "nuqs"
import { iconLibraries, IconLibraryName, type IconLibrary } from "shadcn/icons"

import { Item, ItemContent, ItemTitle } from "@/registry/bases/radix/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

const IconLucide = lazy(() =>
  import("@/registry/icons/icon-lucide").then((mod) => ({
    default: mod.IconLucide,
  }))
)

const IconTabler = lazy(() =>
  import("@/registry/icons/icon-tabler").then((mod) => ({
    default: mod.IconTabler,
  }))
)

const IconHugeicons = lazy(() =>
  import("@/registry/icons/icon-hugeicons").then((mod) => ({
    default: mod.IconHugeicons,
  }))
)

const PREVIEW_ICONS = {
  lucide: [
    "CopyIcon",
    "CircleAlertIcon",
    "TrashIcon",
    "ShareIcon",
    "ShoppingBagIcon",
    "MoreHorizontalIcon",
    "Loader2Icon",
    "PlusIcon",
    "MinusIcon",
    "ArrowLeftIcon",
    "ArrowRightIcon",
    "CheckIcon",
    "ChevronDownIcon",
    "ChevronRightIcon",
  ],
  tabler: [
    "IconCopy",
    "IconExclamationCircle",
    "IconTrash",
    "IconShare",
    "IconShoppingBag",
    "IconDots",
    "IconLoader",
    "IconPlus",
    "IconMinus",
    "IconArrowLeft",
    "IconArrowRight",
    "IconCheck",
    "IconChevronDown",
    "IconChevronRight",
  ],
  hugeicons: [
    "Copy01Icon",
    "AlertCircleIcon",
    "Delete02Icon",
    "Share03Icon",
    "ShoppingBasket02Icon",
    "MoreHorizontalIcon",
    "Loading03Icon",
    "PlusSignIcon",
    "MinusSignIcon",
    "ArrowLeft02Icon",
    "ArrowRight02Icon",
    "Tick02Icon",
    "ArrowDown01Icon",
    "ArrowRight01Icon",
  ],
}

export function IconLibraryPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentIconLibrary = React.useMemo(
    () => iconLibraries[params.iconLibrary],
    [params.iconLibrary]
  )

  return (
    <Select
      value={currentIconLibrary?.name}
      onValueChange={(value) => {
        setParams({ iconLibrary: value as IconLibraryName })
      }}
    >
      <SelectTrigger>
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Icon Library</div>
            <div className="text-foreground text-sm font-medium">
              {currentIconLibrary?.title}
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {Object.values(iconLibraries).map((iconLibrary) => (
          <React.Fragment key={iconLibrary.name}>
            <IconLibraryPickerItem
              iconLibrary={iconLibrary}
              value={iconLibrary.name}
            />
            <SelectSeparator className="opacity-50 last:hidden" />
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}

function IconLibraryPickerItem({
  iconLibrary,
  value,
}: {
  iconLibrary: IconLibrary
  value: string
}) {
  return (
    <SelectItem
      value={value}
      className="rounded-lg pr-2 *:data-[slot=select-item-indicator]:hidden"
    >
      <Item size="xs">
        <ItemContent className="gap-1">
          <ItemTitle className="text-muted-foreground text-xs font-medium">
            {iconLibrary.title}
          </ItemTitle>
          <IconLibraryPreview iconLibrary={iconLibrary.name} />
        </ItemContent>
      </Item>
    </SelectItem>
  )
}

const IconLibraryPreview = memo(function IconLibraryPreview({
  iconLibrary,
}: {
  iconLibrary: IconLibraryName
}) {
  const previewIcons = PREVIEW_ICONS[iconLibrary]

  if (!previewIcons) {
    return null
  }

  const IconRenderer =
    iconLibrary === "lucide"
      ? IconLucide
      : iconLibrary === "tabler"
        ? IconTabler
        : IconHugeicons

  return (
    <Suspense
      fallback={
        <div className="-mx-1 grid w-full grid-cols-7 gap-2">
          {previewIcons.map((iconName) => (
            <div
              key={iconName}
              className="bg-muted size-6 animate-pulse rounded"
            />
          ))}
        </div>
      }
    >
      <div className="-mx-1 grid w-full grid-cols-7 gap-2">
        {previewIcons.map((iconName) => (
          <div
            key={iconName}
            className="flex size-6 items-center justify-center *:[svg]:size-5"
          >
            <IconRenderer name={iconName} />
          </div>
        ))}
      </div>
    </Suspense>
  )
})
