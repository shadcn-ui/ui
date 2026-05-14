"use client"

import * as React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandShortcut,
  useListCollection,
} from "@/examples/ark/ui-rtl/command"
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

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: t.calendar, value: "calendar", group: "suggestions" },
      { label: t.searchEmoji, value: "search-emoji", group: "suggestions" },
      {
        label: t.calculator,
        value: "calculator",
        group: "suggestions",
        disabled: true,
      },
      {
        label: t.profile,
        value: "profile",
        group: "settings",
        shortcut: "⌘P",
      },
      {
        label: t.billing,
        value: "billing",
        group: "settings",
        shortcut: "⌘B",
      },
      {
        label: t.settings,
        value: "settings",
        group: "settings",
        shortcut: "⌘S",
      },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
    groupBy: (item) => item.group,
    groupSort: ["suggestions", "settings"],
  })

  const icons: Record<string, React.ReactNode> = {
    calendar: <Calendar />,
    "search-emoji": <Smile />,
    calculator: <Calculator />,
    profile: <User />,
    billing: <CreditCard />,
    settings: <Settings />,
  }

  const groupLabels: Record<string, string> = {
    suggestions: t.suggestions,
    settings: t.settings,
  }

  return (
    <Command
      className="max-w-sm rounded-lg border"
      collection={collection}
      dir={dir}
    >
      <CommandInput placeholder={t.placeholder} dir={dir} onFilter={filter} />
      <CommandList>
        <CommandEmpty>{t.empty}</CommandEmpty>
        {collection.group().map(([group, items]) => (
          <CommandGroup key={group}>
            <CommandGroupLabel>{groupLabels[group]}</CommandGroupLabel>
            {items.map((item) => (
              <CommandItem key={item.value} item={item}>
                {icons[item.value]}
                <CommandItemText>{item.label}</CommandItemText>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  )
}
