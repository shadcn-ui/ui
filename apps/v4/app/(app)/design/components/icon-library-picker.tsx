"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import {
  iconLibraries,
  IconLibraryName,
  IconName,
  type IconLibrary,
} from "shadcn/icons"

import {
  ToolbarItem,
  ToolbarPicker,
  ToolbarPickerGroup,
  ToolbarPickerItem,
} from "@/app/(app)/design/components/toolbar"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

import { IconForIconLibrary } from "./icon-loader"

const PREVIEW_ICONS = [
  "ArrowDownIcon",
  "ArrowUpIcon",
  "ArrowRightIcon",
  "ArrowLeftIcon",
  "CheckIcon",
  "ChevronDownIcon",
  "ChevronRightIcon",
  "AlertCircleIcon",
  "CopyIcon",
  "TrashIcon",
  "ShareIcon",
  "ShoppingBagIcon",
  "MoreHorizontalIcon",
  "SpinnerIcon",
] as const

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
    <ToolbarItem
      title="Icon Library"
      description={currentIconLibrary?.title ?? null}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <ToolbarPicker
        currentValue={currentIconLibrary?.title ?? null}
        open={open}
      >
        <ToolbarPickerGroup>
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
        </ToolbarPickerGroup>
      </ToolbarPicker>
    </ToolbarItem>
  )
}

function IconLibraryPickerItem({
  iconLibrary,
  ...props
}: React.ComponentProps<typeof ToolbarPickerItem> & {
  iconLibrary: IconLibrary
}) {
  return (
    <ToolbarPickerItem
      key={iconLibrary.name}
      value={iconLibrary.title}
      className="ring-border mb-2 ring-1"
      {...props}
    >
      <div className="flex w-full flex-col gap-1 p-1">
        <span className="text-muted-foreground text-xs font-medium">
          {iconLibrary.title}
        </span>
        <IconLibraryPreview iconLibrary={iconLibrary.name} />
      </div>
    </ToolbarPickerItem>
  )
}

const IconLibraryPreview = React.cache(function IconLibraryPreview({
  iconLibrary,
}: {
  iconLibrary: IconLibraryName
}) {
  return (
    <div className="grid w-full grid-cols-7 gap-2">
      {PREVIEW_ICONS.map((iconName) => (
        <div
          key={iconName}
          className="flex size-6 items-center justify-center *:[svg]:size-5"
        >
          <IconForIconLibrary iconLibrary={iconLibrary} icon={iconName} />
        </div>
      ))}
    </div>
  )
})
