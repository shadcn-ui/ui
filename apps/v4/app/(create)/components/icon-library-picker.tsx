"use client"

import * as React from "react"
import { lazy, memo, Suspense } from "react"

import { Item, ItemContent, ItemTitle } from "@/registry/bases/radix/ui/item"
import {
  iconLibraries,
  type IconLibrary,
  type IconLibraryName,
} from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

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

const IconPhosphor = lazy(() =>
  import("@/registry/icons/icon-phosphor").then((mod) => ({
    default: mod.IconPhosphor,
  }))
)

const IconRemixicon = lazy(() =>
  import("@/registry/icons/icon-remixicon").then((mod) => ({
    default: mod.IconRemixicon,
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
    "ShoppingBag01Icon",
    "MoreHorizontalCircle01Icon",
    "Loading03Icon",
    "PlusSignIcon",
    "MinusSignIcon",
    "ArrowLeft02Icon",
    "ArrowRight02Icon",
    "Tick02Icon",
    "ArrowDown01Icon",
    "ArrowRight01Icon",
  ],
  phosphor: [
    "CopyIcon",
    "WarningCircleIcon",
    "TrashIcon",
    "ShareIcon",
    "BagIcon",
    "DotsThreeIcon",
    "SpinnerIcon",
    "PlusIcon",
    "MinusIcon",
    "ArrowLeftIcon",
    "ArrowRightIcon",
    "CheckIcon",
    "CaretDownIcon",
    "CaretRightIcon",
  ],
  remixicon: [
    "RiFileCopyLine",
    "RiErrorWarningLine",
    "RiDeleteBinLine",
    "RiShareLine",
    "RiShoppingBagLine",
    "RiMoreLine",
    "RiLoaderLine",
    "RiAddLine",
    "RiSubtractLine",
    "RiArrowLeftLine",
    "RiArrowRightLine",
    "RiCheckLine",
    "RiArrowDownSLine",
    "RiArrowRightSLine",
  ],
}

const logos = {
  lucide: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        d="M14 12a4 4 0 0 0-8 0 8 8 0 1 0 16 0 11.97 11.97 0 0 0-4-8.944"
      />
      <path
        stroke="currentColor"
        d="M10 12a4 4 0 0 0 8 0 8 8 0 1 0-16 0 11.97 11.97 0 0 0 4.063 9"
      />
    </svg>
  ),
  tabler: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        fill="currentColor"
        d="M31.288 7.107A8.83 8.83 0 0 0 24.893.712a55.9 55.9 0 0 0-17.786 0A8.83 8.83 0 0 0 .712 7.107a55.9 55.9 0 0 0 0 17.786 8.83 8.83 0 0 0 6.395 6.395c5.895.95 11.89.95 17.786 0a8.83 8.83 0 0 0 6.395-6.395c.95-5.895.95-11.89 0-17.786"
      />
      <path
        fill="#fff"
        d="m17.884 9.076 1.5-2.488 6.97 6.977-2.492 1.494zm-7.96 3.127 7.814-.909 3.91 3.66-.974 7.287-9.582 2.159a3.06 3.06 0 0 1-2.17-.329l5.244-4.897c.91.407 2.003.142 2.587-.626.584-.77.488-1.818-.226-2.484s-1.84-.755-2.664-.21c-.823.543-1.107 1.562-.67 2.412l-5.245 4.89a2.53 2.53 0 0 1-.339-2.017z"
      />
    </svg>
  ),
  hugeicons: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M2 9.5H22" stroke="currentColor"></path>
      <path
        d="M20.5 9.5H3.5L4.23353 15.3682C4.59849 18.2879 4.78097 19.7477 5.77343 20.6239C6.76589 21.5 8.23708 21.5 11.1795 21.5H12.8205C15.7629 21.5 17.2341 21.5 18.2266 20.6239C19.219 19.7477 19.4015 18.2879 19.7665 15.3682L20.5 9.5Z"
        stroke="currentColor"
      ></path>
      <path
        d="M5 9C5 5.41015 8.13401 2.5 12 2.5C15.866 2.5 19 5.41015 19 9"
        stroke="currentColor"
      ></path>
    </svg>
  ),
  phosphor: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
    >
      <path fill="none" d="M0 0h32v32H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5h9v16H9zm9 16v9a9 9 0 0 1-9-9M9 5l9 16m0 0h1a8 8 0 0 0 0-16h-1"
      />
    </svg>
  ),
  remixicon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 15.3137 19.3137 18 16 18C12.6863 18 10 15.3137 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 16.4183 11.5817 20 16 20C16.8708 20 17.7084 19.8588 18.4932 19.6016C16.7458 21.0956 14.4792 22 12 22C6.6689 22 2.3127 17.8283 2.0166 12.5713C2.23647 9.45772 4.83048 7 8 7C11.3137 7 14 9.68629 14 13C14 13.5523 14.4477 14 15 14C15.5523 14 16 13.5523 16 13C16 8.58172 12.4183 5 8 5C6.50513 5 5.1062 5.41032 3.90918 6.12402C5.72712 3.62515 8.67334 2 12 2Z" />
    </svg>
  ),
}

export function IconLibraryPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()

  const currentIconLibrary = React.useMemo(
    () => iconLibraries[params.iconLibrary as keyof typeof iconLibraries],
    [params.iconLibrary]
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Icon Library</div>
            <div className="text-foreground text-sm font-medium">
              {currentIconLibrary?.title}
            </div>
          </div>
          <div className="text-foreground *:[svg]:text-foreground! pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base select-none">
            {logos[currentIconLibrary?.name as keyof typeof logos]}
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentIconLibrary?.name}
            onValueChange={(value) => {
              setParams({ iconLibrary: value as IconLibraryName })
            }}
          >
            <PickerGroup>
              {Object.values(iconLibraries).map((iconLibrary, index) => (
                <React.Fragment key={iconLibrary.name}>
                  <IconLibraryPickerItem
                    iconLibrary={iconLibrary}
                    value={iconLibrary.name}
                  />
                  {index < Object.values(iconLibraries).length - 1 && (
                    <PickerSeparator className="opacity-50" />
                  )}
                </React.Fragment>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="iconLibrary"
        className="absolute top-1/2 right-10 -translate-y-1/2"
      />
    </div>
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
    <PickerRadioItem
      value={value}
      className="pr-2 *:data-[slot=dropdown-menu-radio-item-indicator]:hidden"
    >
      <Item size="xs">
        <ItemContent className="gap-1">
          <ItemTitle className="text-muted-foreground text-xs font-medium">
            {iconLibrary.title}
          </ItemTitle>
          <IconLibraryPreview iconLibrary={iconLibrary.name} />
        </ItemContent>
      </Item>
    </PickerRadioItem>
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
        : iconLibrary === "hugeicons"
          ? IconHugeicons
          : iconLibrary === "phosphor"
            ? IconPhosphor
            : IconRemixicon

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
