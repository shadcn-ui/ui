"use client"

import * as React from "react"
import { lazy, memo, Suspense } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { iconLibraries, IconLibraryName, type IconLibrary } from "shadcn/icons"

import {
  CustomizerItem,
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(design)/design/components/customizer"
import { designSystemSearchParams } from "@/app/(design)/design/lib/search-params"

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
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const handleSelect = React.useCallback(
    (iconLibrary: IconLibraryName) => {
      setParams({ iconLibrary })
      setOpen(false)
    },
    [setParams]
  )

  const currentIconLibrary = React.useMemo(
    () => iconLibraries[params.iconLibrary],
    [params.iconLibrary]
  )

  return (
    <CustomizerItem
      title="Icon Library"
      description={currentIconLibrary?.title ?? null}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <CustomizerPicker
        currentValue={currentIconLibrary?.title ?? null}
        open={open}
        className="**:data-[slot=command-list]:max-h-none"
      >
        <CustomizerPickerGroup>
          {Object.values(iconLibraries).map((iconLibrary) => (
            <IconLibraryPickerItem
              key={iconLibrary.name}
              iconLibrary={iconLibrary}
              onSelect={() => handleSelect(iconLibrary.name)}
              isActive={iconLibrary.name === params.iconLibrary}
            >
              {iconLibrary.title}
            </IconLibraryPickerItem>
          ))}
        </CustomizerPickerGroup>
      </CustomizerPicker>
    </CustomizerItem>
  )
}

function IconLibraryPickerItem({
  iconLibrary,
  ...props
}: React.ComponentProps<typeof CustomizerPickerItem> & {
  iconLibrary: IconLibrary
}) {
  return (
    <CustomizerPickerItem
      key={iconLibrary.name}
      value={iconLibrary.title}
      className="ring-border ring-1 not-last:mb-2"
      {...props}
    >
      <div className="flex w-full flex-col gap-1.5 p-1">
        <span className="text-muted-foreground text-xs font-medium">
          {iconLibrary.title}
        </span>
        <IconLibraryPreview iconLibrary={iconLibrary.name} />
      </div>
    </CustomizerPickerItem>
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
