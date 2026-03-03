"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/examples/base/ui-rtl/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/examples/base/ui-rtl/input-group"
import { Separator } from "@/examples/base/ui-rtl/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui-rtl/tooltip"
import {
  IconCheck,
  IconChevronDown,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react"
import { ArrowUpIcon, Search } from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    search: "بحث...",
    results: "12 نتيجة",
    example: "example.com",
    tooltipContent: "هذا محتوى في تلميح.",
    askSearchChat: "اسأل، ابحث أو تحدث...",
    add: "إضافة",
    auto: "تلقائي",
    agent: "وكيل",
    manual: "يدوي",
    used: "52% مستخدم",
    send: "إرسال",
  },
  he: {
    dir: "rtl" as const,
    search: "חיפוש...",
    results: "12 תוצאות",
    example: "example.com",
    tooltipContent: "זה תוכן בטולטיפ.",
    askSearchChat: "שאל, חפש או שוחח...",
    add: "הוסף",
    auto: "אוטומטי",
    agent: "סוכן",
    manual: "ידני",
    used: "52% בשימוש",
    send: "שלח",
  },
}

export function InputGroupDemo() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]

  return (
    <div dir={t.dir} className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder={t.search} />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">{t.results}</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder={t.example} />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton
                  className="rounded-full"
                  size="icon-xs"
                  aria-label={t.add}
                />
              }
            >
              <IconInfoCircle />
            </TooltipTrigger>
            <TooltipContent>{t.tooltipContent}</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder={t.askSearchChat} />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
            aria-label={t.add}
          >
            <IconPlus />
          </InputGroupButton>
          <DropdownMenu>
            <DropdownMenuTrigger render={<InputGroupButton variant="ghost" />}>
              <IconChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem>{t.auto}</DropdownMenuItem>
              <DropdownMenuItem>{t.agent}</DropdownMenuItem>
              <DropdownMenuItem>{t.manual}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupText className="ms-auto">{t.used}</InputGroupText>
          <Separator orientation="vertical" className="h-4!" />
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
          >
            <ArrowUpIcon />
            <span className="sr-only">{t.send}</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="shadcn" />
        <InputGroupAddon align="inline-end">
          <div className="flex size-4 items-center justify-center rounded-full bg-primary text-foreground">
            <IconCheck className="size-3 text-white" />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
