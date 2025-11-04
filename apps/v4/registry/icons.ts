import { ShoppingBag } from "lucide-react"

import { type IconLibrary } from "@/registry/icon-libraries"

export const icons = {
  AccordionTrigger: {
    lucide: "ChevronDownIcon",
    tabler: "IconCircleChevronDown",
  },
  CheckboxCheck: {
    lucide: "CheckIcon",
    tabler: "IconCheck",
  },
  SelectTriggerArrow: {
    lucide: "ChevronDownIcon",
    tabler: "IconSelector",
  },
  SelectItemCheck: {
    lucide: "CheckIcon",
    tabler: "IconCheck",
  },
  SelectScrollUpButton: {
    lucide: "ChevronUpIcon",
    tabler: "IconChevronUp",
  },
  SelectScrollDownButton: {
    lucide: "ChevronDownIcon",
    tabler: "IconChevronDown",
  },
  ButtonSend: {
    lucide: "SendIcon",
    tabler: "IconShare",
  },
  BadgeCheckIcon: {
    lucide: "BadgeCheckIcon",
    tabler: "IconRosetteDiscountCheck",
  },
  ChevronRightIcon: {
    lucide: "ChevronRightIcon",
    tabler: "IconChevronRight",
  },
  ChevronDownIcon: {
    lucide: "ChevronDownIcon",
    tabler: "IconChevronDown",
  },
  AlertCircleIcon: {
    lucide: "AlertCircleIcon",
    tabler: "IconAlertCircle",
  },
  BookmarkCheckIcon: {
    lucide: "BookmarkCheckIcon",
    tabler: "IconBookmark",
  },
  CheckCircle2Icon: {
    lucide: "CheckCircle2Icon",
    tabler: "IconCircleCheck",
  },
  GiftIcon: {
    lucide: "GiftIcon",
    tabler: "IconGift",
  },
  ShoppingBagIcon: {
    lucide: "ShoppingBagIcon",
    tabler: "IconShoppingBag",
  },
  ShieldAlertIcon: {
    lucide: "ShieldAlertIcon",
    tabler: "IconShield",
  },
} as const satisfies Record<string, Record<IconLibrary, string>>

export type IconName = keyof typeof icons
