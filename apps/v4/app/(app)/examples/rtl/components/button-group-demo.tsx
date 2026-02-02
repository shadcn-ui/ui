"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import { ButtonGroup } from "@/examples/base/ui-rtl/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/examples/base/ui-rtl/dropdown-menu"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    goBack: "رجوع",
    archive: "أرشفة",
    report: "إبلاغ",
    snooze: "تأجيل",
    moreOptions: "خيارات أخرى",
    markAsRead: "تحديد كمقروء",
    addToCalendar: "إضافة إلى التقويم",
    addToList: "إضافة إلى القائمة",
    labelAs: "تصنيف كـ...",
    personal: "شخصي",
    work: "عمل",
    other: "أخرى",
    trash: "حذف",
  },
  he: {
    dir: "rtl" as const,
    goBack: "חזור",
    archive: "ארכיון",
    report: "דווח",
    snooze: "נודניק",
    moreOptions: "אפשרויות נוספות",
    markAsRead: "סמן כנקרא",
    addToCalendar: "הוסף ליומן",
    addToList: "הוסף לרשימה",
    labelAs: "תייג כ...",
    personal: "אישי",
    work: "עבודה",
    other: "אחר",
    trash: "מחק",
  },
}

export function ButtonGroupDemo() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]
  const [label, setLabel] = React.useState("personal")

  return (
    <div dir={t.dir}>
      <ButtonGroup>
        <ButtonGroup className="hidden sm:flex">
          <Button variant="outline" size="icon-sm" aria-label={t.goBack}>
            <ArrowLeftIcon className="rtl:rotate-180" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            {t.archive}
          </Button>
          <Button variant="outline" size="sm">
            {t.report}
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            {t.snooze}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t.moreOptions}
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              dir={t.dir}
              data-lang={lang}
              className="w-44"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MailCheckIcon />
                  {t.markAsRead}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon />
                  {t.archive}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ClockIcon />
                  {t.snooze}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarPlusIcon />
                  {t.addToCalendar}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListFilterIcon />
                  {t.addToList}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <TagIcon />
                    {t.labelAs}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent
                      side="left"
                      dir={t.dir}
                      data-lang={lang}
                    >
                      <DropdownMenuRadioGroup
                        value={label}
                        onValueChange={setLabel}
                      >
                        <DropdownMenuRadioItem value="personal">
                          {t.personal}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="work">
                          {t.work}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="other">
                          {t.other}
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  {t.trash}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  )
}
