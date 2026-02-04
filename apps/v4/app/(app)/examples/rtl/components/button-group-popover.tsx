"use client"

import { Button } from "@/examples/base/ui-rtl/button"
import { ButtonGroup } from "@/examples/base/ui-rtl/button-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/base/ui-rtl/popover"
import { Separator } from "@/examples/base/ui-rtl/separator"
import { Textarea } from "@/examples/base/ui-rtl/textarea"
import { BotIcon, ChevronDownIcon } from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    copilot: "المساعد",
    openPopover: "فتح القائمة",
    agentTasks: "مهام الوكيل",
    placeholder: "صف مهمتك بلغة طبيعية.",
    startTask: "ابدأ مهمة جديدة مع المساعد",
    description:
      "صف مهمتك بلغة طبيعية. سيعمل المساعد في الخلفية ويفتح طلب سحب لمراجعتك.",
  },
  he: {
    dir: "rtl" as const,
    copilot: "עוזר",
    openPopover: "פתח תפריט",
    agentTasks: "משימות סוכן",
    placeholder: "תאר את המשימה שלך בשפה טבעית.",
    startTask: "התחל משימה חדשה עם העוזר",
    description:
      "תאר את המשימה שלך בשפה טבעית. העוזר יעבוד ברקע ויפתח בקשת משיכה לבדיקתך.",
  },
  fa: {
    dir: "rtl" as const,
    copilot: "دستیار",
    openPopover: "باز کردن فهرست",
    agentTasks: "وظایف دستیار",
    placeholder: "وظیفه‌تان را به زبان طبیعی توصیف کنید.",
    startTask: "شروع یک وظیفه جدید با دستیار",
    description:
      "وظیفه‌تان را به زبان طبیعی توصیف کنید. دستیار در پس‌زمینه کار می‌کند و یک درخواست pull برای بررسی شما باز می‌کند.",
  },
}

export function ButtonGroupPopover() {
  const context = useLanguageContext()
  const lang = (['ar', 'he', 'fa'] as const).includes(
    context?.language as any
  )
    ? (context?.language as 'ar' | 'he' | 'fa')
    : 'ar'
  const t = translations[lang]

  return (
    <ButtonGroup dir={t.dir}>
      <Button variant="outline" size="sm">
        <BotIcon /> {t.copilot}
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.openPopover}
            />
          }
        >
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          dir={t.dir}
          data-lang={lang}
          className="p-0"
        >
          <div className="px-4 py-3">
            <div className="text-sm font-medium">{t.agentTasks}</div>
          </div>
          <Separator />
          <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
            <Textarea
              placeholder={t.placeholder}
              className="mb-4 resize-none"
            />
            <p className="font-medium">{t.startTask}</p>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
