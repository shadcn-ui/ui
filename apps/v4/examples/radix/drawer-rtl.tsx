"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui-rtl/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/examples/radix/ui-rtl/drawer"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

const translations: Translations = {
  en: {
    dir: "ltr",
    locale: "en-US",
    values: {
      trigger: "Open Drawer",
      title: "Move Goal",
      description: "Set your daily activity goal.",
      caloriesPerDay: "Calories/day",
      decrease: "Decrease",
      increase: "Increase",
      submit: "Submit",
      cancel: "Cancel",
    },
  },
  ar: {
    dir: "rtl",
    locale: "ar-EG",
    values: {
      trigger: "فتح الدرج",
      title: "نقل الهدف",
      description: "حدد هدف نشاطك اليومي.",
      caloriesPerDay: "سعرات حرارية/يوم",
      decrease: "تقليل",
      increase: "زيادة",
      submit: "إرسال",
      cancel: "إلغاء",
    },
  },
  he: {
    dir: "rtl",
    locale: "he-IL",
    values: {
      trigger: "פתח מגירה",
      title: "הזז מטרה",
      description: "הגדר את יעד הפעילות היומי שלך.",
      caloriesPerDay: "קלוריות/יום",
      decrease: "הקטן",
      increase: "הגדל",
      submit: "שלח",
      cancel: "בטל",
    },
  },
}

export function DrawerRtl() {
  const { dir, locale, language, t } = useTranslation(translations, "ar")
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </DrawerTrigger>
      <DrawerContent dir={dir} data-lang={dir === "rtl" ? language : undefined}>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t.title}</DrawerTitle>
            <DrawerDescription>{t.description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <Minus />
                <span className="sr-only">{t.decrease}</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal.toLocaleString(locale)}
                </div>
                <div className="text-[0.70rem] text-muted-foreground uppercase">
                  {t.caloriesPerDay}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <Plus />
                <span className="sr-only">{t.increase}</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis
                    dataKey="goal"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString(locale)}
                    reversed={dir === "rtl"}
                  />
                  <Bar
                    dataKey="goal"
                    style={
                      {
                        fill: "var(--chart-2)",
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button>{t.submit}</Button>
            <DrawerClose asChild>
              <Button variant="outline">{t.cancel}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
