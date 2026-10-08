"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/styles/aria-nova/ui-rtl/command"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Type a command or search...",
      empty: "No results found.",
      suggestions: "Suggestions",
      calendar: "Calendar",
      searchEmoji: "Search Emoji",
      calculator: "Calculator",
      settings: "Settings",
      profile: "Profile",
      billing: "Billing",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اكتب أمرًا أو ابحث...",
      empty: "لم يتم العثور على نتائج.",
      suggestions: "اقتراحات",
      calendar: "التقويم",
      searchEmoji: "البحث عن الرموز التعبيرية",
      calculator: "الآلة الحاسبة",
      settings: "الإعدادات",
      profile: "الملف الشخصي",
      billing: "الفوترة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "הקלד פקודה או חפש...",
      empty: "לא נמצאו תוצאות.",
      suggestions: "הצעות",
      calendar: "לוח שנה",
      searchEmoji: "חפש אמוג'י",
      calculator: "מחשבון",
      settings: "הגדרות",
      profile: "פרופיל",
      billing: "חיוב",
    },
  },
}

export function CommandRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Command className="max-w-sm rounded-lg border" dir={dir}>
      <CommandInput placeholder={t.placeholder} dir={dir} />
      <CommandList
        renderEmptyState={() => <CommandEmpty>{t.empty}</CommandEmpty>}
      >
        <CommandGroup heading={t.suggestions}>
          <CommandItem textValue={t.calendar}>
            <Calendar />
            <span>{t.calendar}</span>
          </CommandItem>
          <CommandItem textValue={t.searchEmoji}>
            <Smile />
            <span>{t.searchEmoji}</span>
          </CommandItem>
          <CommandItem textValue={t.calculator} isDisabled>
            <Calculator />
            <span>{t.calculator}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t.settings}>
          <CommandItem textValue={t.profile}>
            <User />
            <span>{t.profile}</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem textValue={t.billing}>
            <CreditCard />
            <span>{t.billing}</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem textValue={t.settings}>
            <Settings />
            <span>{t.settings}</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
