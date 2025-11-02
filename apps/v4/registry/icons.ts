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
} as const satisfies Record<string, Record<IconLibrary, string>>

export type IconName = keyof typeof icons
