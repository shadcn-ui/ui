import { type IconLibrary } from "@/registry/icon-libraries"

export const icons = {
  SelectTriggerArrow: {
    lucide: "ChevronDownIcon",
    radix: "ChevronDownIcon",
    solar: "AltArrowDown",
    tabler: "IconSelector",
  },
  SelectItemCheck: {
    lucide: "CircleCheckIcon",
    radix: "CheckIcon",
    solar: "CheckCircle",
    tabler: "IconCheck",
  },
  SelectScrollUpButton: {
    lucide: "ChevronUpIcon",
    radix: "ChevronUpIcon",
    solar: "AltArrowUp",
    tabler: "IconChevronUp",
  },
  SelectScrollDownButton: {
    lucide: "ChevronDownIcon",
    radix: "ChevronDownIcon",
    solar: "AltArrowDown",
    tabler: "IconChevronDown",
  },
  ButtonSend: {
    lucide: "SendIcon",
    radix: "SendIcon",
    solar: "Plain2",
    tabler: "IconShare",
  },
} as const satisfies Record<string, Record<IconLibrary, string>>

export type IconName = keyof typeof icons
