import { type IconLibrary } from "@/registry/icon-libraries"

export const icons = {
  AccordionTrigger: {
    lucide: "ChevronDownIcon",
    tabler: "IconCircleChevronDown",
    hugeicons: "UnfoldMoreIcon",
  },
  CheckboxCheck: {
    lucide: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick01Icon",
  },
  SelectTriggerArrow: {
    lucide: "ChevronDownIcon",
    tabler: "IconSelector",
    hugeicons: "UnfoldMoreIcon",
  },
  SelectItemCheck: {
    lucide: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick01Icon",
  },
  SelectScrollUpButton: {
    lucide: "ChevronUpIcon",
    tabler: "IconChevronUp",
    hugeicons: "ArrowRight01Icon",
  },
  SelectScrollDownButton: {
    lucide: "ChevronDownIcon",
    tabler: "IconChevronDown",
    hugeicons: "ArrowRight01Icon",
  },
  DropdownMenuCheckIndicator: {
    lucide: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick01Icon",
  },
  DropdownMenuRadioIndicator: {
    lucide: "CircleIcon",
    tabler: "IconCircle",
    hugeicons: "CircleIcon",
  },
  DropdownMenuSubTriggerIcon: {
    lucide: "ChevronRightIcon",
    tabler: "IconChevronRight",
    hugeicons: "ArrowRight01Icon",
  },
  RadioGroupIndicator: {
    lucide: "CircleIcon",
    tabler: "IconCircle",
    hugeicons: "CircleIcon",
  },
  SpinnerIcon: {
    lucide: "Loader2Icon",
    tabler: "IconLoader",
    hugeicons: "Loading03Icon",
  },

  // Other.
  ArrowUpIcon: {
    lucide: "ArrowUpIcon",
    tabler: "IconArrowUp",
    hugeicons: "ArrowUp02Icon",
  },
  ArrowDownIcon: {
    lucide: "ArrowDownIcon",
    tabler: "IconArrowDown",
    hugeicons: "ArrowDown02Icon",
  },
  ArrowRightIcon: {
    lucide: "ArrowRightIcon",
    tabler: "IconArrowRight",
    hugeicons: "ArrowRight02Icon",
  },
  ArrowLeftIcon: {
    lucide: "ArrowLeftIcon",
    tabler: "IconArrowLeft",
    hugeicons: "ArrowLeft02Icon",
  },
  BluetoothIcon: {
    lucide: "BluetoothIcon",
    tabler: "IconBluetooth",
    hugeicons: "BluetoothSquareIcon",
  },
  ChevronRightIcon: {
    lucide: "ChevronRightIcon",
    tabler: "IconChevronRight",
    hugeicons: "ArrowRight01Icon",
  },
  ChevronDownIcon: {
    lucide: "ChevronDownIcon",
    tabler: "IconChevronDown",
    hugeicons: "ArrowDown01Icon",
  },
  ChevronLeftIcon: {
    lucide: "ChevronLeftIcon",
    tabler: "IconChevronLeft",
    hugeicons: "ArrowLeft01Icon",
  },
  ChevronUpIcon: {
    lucide: "ChevronUpIcon",
    tabler: "IconChevronUp",
    hugeicons: "ArrowUp01Icon",
  },
  AlertCircleIcon: {
    lucide: "AlertCircleIcon",
    tabler: "IconAlertCircle",
    hugeicons: "AlertCircleIcon",
  },
  BookmarkCheckIcon: {
    lucide: "BookmarkCheckIcon",
    tabler: "IconBookmark",
    hugeicons: "BookmarkCheck02Icon",
  },
  CheckCircle2Icon: {
    lucide: "CheckCircle2Icon",
    tabler: "IconCircleCheck",
    hugeicons: "CheckmarkCircle01Icon",
  },
  GiftIcon: {
    lucide: "GiftIcon",
    tabler: "IconGift",
    hugeicons: "GiftIcon",
  },
  ShoppingBagIcon: {
    lucide: "ShoppingBagIcon",
    tabler: "IconShoppingBag",
    hugeicons: "ShoppingBasket02Icon",
  },
  ShieldAlertIcon: {
    lucide: "ShieldAlertIcon",
    tabler: "IconShield",
    hugeicons: "KnightShieldIcon",
  },
  VolumeOffIcon: {
    lucide: "VolumeOffIcon",
    tabler: "IconVolume",
    hugeicons: "VolumeOffIcon",
  },
  CheckIcon: {
    lucide: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick01Icon",
  },
  AlertTriangleIcon: {
    lucide: "AlertTriangleIcon",
    tabler: "IconAlertTriangle",
    hugeicons: "Alert02Icon",
  },
  UserRoundXIcon: {
    lucide: "UserRoundXIcon",
    tabler: "IconUserX",
    hugeicons: "UserRemove01Icon",
  },
  ShareIcon: {
    lucide: "ShareIcon",
    tabler: "IconShare",
    hugeicons: "Share03Icon",
  },
  CopyIcon: {
    lucide: "CopyIcon",
    tabler: "IconCopy",
    hugeicons: "Copy01Icon",
  },
  BadgeCheckIcon: {
    lucide: "BadgeCheckIcon",
    tabler: "IconRosetteDiscountCheck",
    hugeicons: "CheckmarkBadge01Icon",
  },
  TrashIcon: {
    lucide: "TrashIcon",
    tabler: "IconTrash",
    hugeicons: "Delete02Icon",
  },
  MoreHorizontalIcon: {
    lucide: "MoreHorizontalIcon",
    tabler: "IconDots",
    hugeicons: "MoreHorizontalIcon",
  },
} as const satisfies Record<string, Record<IconLibrary, string>>

export type IconName = keyof typeof icons
