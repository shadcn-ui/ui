"use client"

import { type IconLibraryName } from "shadcn/icons"

import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const PREVIEW_ICONS = [
  {
    lucide: "CopyIcon",
    materialSymbols: "content_copy",
    tabler: "IconCopy",
    hugeicons: "Copy01Icon",
    phosphor: "CopyIcon",
    remixicon: "RiFileCopyLine",
  },
  {
    lucide: "CircleAlertIcon",
    materialSymbols: "error",
    tabler: "IconExclamationCircle",
    hugeicons: "AlertCircleIcon",
    phosphor: "WarningCircleIcon",
    remixicon: "RiErrorWarningLine",
  },
  {
    lucide: "TrashIcon",
    materialSymbols: "delete",
    tabler: "IconTrash",
    hugeicons: "Delete02Icon",
    phosphor: "TrashIcon",
    remixicon: "RiDeleteBinLine",
  },
  {
    lucide: "ShareIcon",
    materialSymbols: "share",
    tabler: "IconShare",
    hugeicons: "Share03Icon",
    phosphor: "ShareIcon",
    remixicon: "RiShareLine",
  },
  {
    lucide: "ShoppingBagIcon",
    materialSymbols: "shopping_bag",
    tabler: "IconShoppingBag",
    hugeicons: "ShoppingBag01Icon",
    phosphor: "BagIcon",
    remixicon: "RiShoppingBagLine",
  },
  {
    lucide: "MoreHorizontalIcon",
    materialSymbols: "more_horiz",
    tabler: "IconDots",
    hugeicons: "MoreHorizontalCircle01Icon",
    phosphor: "DotsThreeIcon",
    remixicon: "RiMoreLine",
  },
  {
    lucide: "Loader2Icon",
    materialSymbols: "progress_activity",
    tabler: "IconLoader",
    hugeicons: "Loading03Icon",
    phosphor: "SpinnerIcon",
    remixicon: "RiLoaderLine",
  },
  {
    lucide: "PlusIcon",
    materialSymbols: "add",
    tabler: "IconPlus",
    hugeicons: "PlusSignIcon",
    phosphor: "PlusIcon",
    remixicon: "RiAddLine",
  },
  {
    lucide: "MinusIcon",
    materialSymbols: "remove",
    tabler: "IconMinus",
    hugeicons: "MinusSignIcon",
    phosphor: "MinusIcon",
    remixicon: "RiSubtractLine",
  },
  {
    lucide: "ArrowLeftIcon",
    materialSymbols: "arrow_left",
    tabler: "IconArrowLeft",
    hugeicons: "ArrowLeft02Icon",
    phosphor: "ArrowLeftIcon",
    remixicon: "RiArrowLeftLine",
  },
  {
    lucide: "ArrowRightIcon",
    materialSymbols: "arrow_right",
    tabler: "IconArrowRight",
    hugeicons: "ArrowRight02Icon",
    phosphor: "ArrowRightIcon",
    remixicon: "RiArrowRightLine",
  },
  {
    lucide: "CheckIcon",
    materialSymbols: "check",
    tabler: "IconCheck",
    hugeicons: "Tick02Icon",
    phosphor: "CheckIcon",
    remixicon: "RiCheckLine",
  },
  {
    lucide: "ChevronDownIcon",
    materialSymbols: "keyboard_arrow_down",
    tabler: "IconChevronDown",
    hugeicons: "ArrowDown01Icon",
    phosphor: "CaretDownIcon",
    remixicon: "RiArrowDownSLine",
  },
  {
    lucide: "ChevronRightIcon",
    materialSymbols: "chevron_right",
    tabler: "IconChevronRight",
    hugeicons: "ArrowRight01Icon",
    phosphor: "CaretRightIcon",
    remixicon: "RiArrowRightSLine",
  },
  {
    lucide: "SearchIcon",
    materialSymbols: "search",
    tabler: "IconSearch",
    hugeicons: "Search01Icon",
    phosphor: "MagnifyingGlassIcon",
    remixicon: "RiSearchLine",
  },
  {
    lucide: "SettingsIcon",
    materialSymbols: "settings",
    tabler: "IconSettings",
    hugeicons: "Settings01Icon",
    phosphor: "GearIcon",
    remixicon: "RiSettingsLine",
  },
] satisfies Record<IconLibraryName, string>[]

export function IconPreviewGrid() {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-8 place-items-center gap-4">
          {PREVIEW_ICONS.map((icon, index) => (
            <div
              key={index}
              className="style-sera:rounded-none flex size-8 items-center justify-center rounded-md ring ring-border *:[svg]:size-4"
            >
              <IconPlaceholder
                lucide={icon.lucide}
                materialSymbols={icon.materialSymbols}
                tabler={icon.tabler}
                hugeicons={icon.hugeicons}
                phosphor={icon.phosphor}
                remixicon={icon.remixicon}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
