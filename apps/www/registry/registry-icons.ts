export const iconLibraries = {
  lucide: {
    name: "lucide-react",
    package: "lucide-react",
    import: "lucide-react",
  },
  radix: {
    name: "@radix-ui/react-icons",
    package: "@radix-ui/react-icons",
    import: "@radix-ui/react-icons",
  },
} as const

export const icons: Record<
  string,
  Record<keyof typeof iconLibraries, string>
> = {
  AlertCircle: {
    lucide: "AlertCircle",
    radix: "ExclamationTriangleIcon",
  },
  ArrowLeft: {
    lucide: "ArrowLeft",
    radix: "ArrowLeftIcon",
  },
  ArrowRight: {
    lucide: "ArrowRight",
    radix: "ArrowRightIcon",
  },
  ArrowUpDown: {
    lucide: "ArrowUpDown",
    radix: "CaretSortIcon",
  },
  BellRing: {
    lucide: "BellRing",
    radix: "BellIcon",
  },
  Bold: {
    lucide: "Bold",
    radix: "FontBoldIcon",
  },
  Calculator: {
    lucide: "Calculator",
    radix: "ComponentPlaceholderIcon",
  },
  Calendar: {
    lucide: "Calendar",
    radix: "CalendarIcon",
  },
  Check: {
    lucide: "Check",
    radix: "CheckIcon",
  },
  ChevronDown: {
    lucide: "ChevronDown",
    radix: "ChevronDownIcon",
  },
  ChevronLeft: {
    lucide: "ChevronLeft",
    radix: "ChevronLeftIcon",
  },
  ChevronRight: {
    lucide: "ChevronRight",
    radix: "ChevronRightIcon",
  },
  ChevronUp: {
    lucide: "ChevronUp",
    radix: "ChevronUpIcon",
  },
  ChevronsUpDown: {
    lucide: "ChevronsUpDown",
    radix: "CaretSortIcon",
  },
  Circle: {
    lucide: "Circle",
    radix: "DotFilledIcon",
  },
  Copy: {
    lucide: "Copy",
    radix: "CopyIcon",
  },
  CreditCard: {
    lucide: "CreditCard",
    radix: "ComponentPlaceholderIcon",
  },
  GripVertical: {
    lucide: "GripVertical",
    radix: "DragHandleDots2Icon",
  },
  Italic: {
    lucide: "Italic",
    radix: "FontItalicIcon",
  },
  Loader2: {
    lucide: "Loader2",
    radix: "ReloadIcon",
  },
  Mail: {
    lucide: "Mail",
    radix: "EnvelopeClosedIcon",
  },
  MailOpen: {
    lucide: "MailOpen",
    radix: "EnvelopeOpenIcon",
  },
  Minus: {
    lucide: "Minus",
    radix: "MinusIcon",
  },
  Moon: {
    lucide: "Moon",
    radix: "MoonIcon",
  },
  MoreHorizontal: {
    lucide: "MoreHorizontal",
    radix: "DotsHorizontalIcon",
  },
  PanelLeft: {
    lucide: "PanelLeft",
    radix: "ViewVerticalIcon",
  },
  Plus: {
    lucide: "Plus",
    radix: "PlusIcon",
  },
  Search: {
    lucide: "Search",
    radix: "MagnifyingGlassIcon",
  },
  Send: {
    lucide: "Send",
    radix: "PaperPlaneIcon",
  },
  Settings: {
    lucide: "Settings",
    radix: "GearIcon",
  },
  Slash: {
    lucide: "Slash",
    radix: "SlashIcon",
  },
  Smile: {
    lucide: "Smile",
    radix: "FaceIcon",
  },
  Sun: {
    lucide: "Sun",
    radix: "SunIcon",
  },
  Terminal: {
    lucide: "Terminal",
    radix: "RocketIcon",
  },
  Underline: {
    lucide: "Underline",
    radix: "UnderlineIcon",
  },
  User: {
    lucide: "User",
    radix: "PersonIcon",
  },
  X: {
    lucide: "X",
    radix: "Cross2Icon",
  },
} as const
