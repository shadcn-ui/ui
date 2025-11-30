"use client"

import * as React from "react"
import { lazy, memo, Suspense } from "react"
import { useQueryStates } from "nuqs"
import { iconLibraries, IconLibraryName, type IconLibrary } from "shadcn/icons"

import {
  Select,
  SelectContent,
  SelectItem,
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
      <SelectTrigger className="w-full text-left data-[size=default]:h-14">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs font-medium">
              Icon Library
            </div>
            {currentIconLibrary?.title}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" side="right" align="start">
        {Object.values(iconLibraries).map((iconLibrary) => (
          <IconLibraryPickerItem
            key={iconLibrary.name}
            iconLibrary={iconLibrary}
            value={iconLibrary.name}
          />
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
      className="pr-2 *:data-[slot=select-item-indicator]:hidden"
    >
      <div className="flex w-full flex-col gap-1.5 py-1">
        <span className="text-muted-foreground text-xs font-medium">
          {iconLibrary.title}
        </span>
        <IconLibraryPreview iconLibrary={iconLibrary.name} />
      </div>
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
        <div className="grid w-full grid-cols-7 gap-2">
          {previewIcons.map((iconName) => (
            <div
              key={iconName}
              className="bg-muted size-6 animate-pulse rounded"
            />
          ))}
        </div>
      }
    >
      <div className="grid w-full grid-cols-7 gap-2">
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
