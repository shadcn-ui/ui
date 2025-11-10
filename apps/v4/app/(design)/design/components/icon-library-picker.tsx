"use client"

import * as React from "react"
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

import { IconForIconLibrary } from "./icon-loader"

const PREVIEW_ICONS = {
  lucide: [
    "CopyIcon",
    "AlertCircleIcon",
    "TrashIcon",
    "ShareIcon",
    "ShoppingBagIcon",
    "MoreHorizontalIcon",
    "Loader2Icon",
    "ArrowDownIcon",
    "ArrowUpIcon",
    "ArrowRightIcon",
    "ArrowLeftIcon",
    "CheckIcon",
    "ChevronDownIcon",
    "ChevronRightIcon",
  ],
  tabler: [
    "IconCopy",
    "IconAlertCircle",
    "IconTrash",
    "IconShare",
    "IconShoppingBag",
    "IconDots",
    "IconLoader",
    "IconArrowDown",
    "IconArrowUp",
    "IconArrowRight",
    "IconArrowLeft",
    "IconCheck",
    "IconChevronDown",
    "IconChevronRight",
  ],
  hugeicons: [
    "CopyIcon",
    "AlertCircleIcon",
    "Delete02Icon",
    "ShareIcon",
    "ShoppingBagIcon",
    "MoreHorizontalIcon",
    "Loading03Icon",
    "ArrowDownIcon",
    "ArrowUpIcon",
    "ArrowRightIcon",
    "ArrowLeftIcon",
    "Tick01Icon",
    "ArrowDown01Icon",
    "ArrowRight01Icon",
  ],
}

export function IconLibraryPicker() {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
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
        showSearch
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
      className="ring-border mb-2 ring-1"
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

const IconLibraryPreview = React.cache(function IconLibraryPreview({
  iconLibrary,
}: {
  iconLibrary: IconLibraryName
}) {
  return (
    <div className="grid w-full grid-cols-7 gap-2">
      {PREVIEW_ICONS[iconLibrary].map((iconName) => (
        <div
          key={iconName}
          className="flex size-6 items-center justify-center *:[svg]:size-5"
        >
          <IconForIconLibrary iconLibrary={iconLibrary} iconName={iconName} />
        </div>
      ))}
    </div>
  )
})
