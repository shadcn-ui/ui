"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui-rtl/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/examples/radix/ui-rtl/empty"
import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "No Projects Yet",
      description:
        "You haven't created any projects yet. Get started by creating your first project.",
      createProject: "Create Project",
      importProject: "Import Project",
      learnMore: "Learn More",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "لا توجد مشاريع بعد",
      description: "لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.",
      createProject: "إنشاء مشروع",
      importProject: "استيراد مشروع",
      learnMore: "تعرف على المزيد",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "אין פרויקטים עדיין",
      description:
        "עדיין לא יצרת פרויקטים. התחל על ידי יצירת הפרויקט הראשון שלך.",
      createProject: "צור פרויקט",
      importProject: "ייבא פרויקט",
      learnMore: "למד עוד",
    },
  },
}

export function EmptyRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Empty dir={dir}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>{t.title}</EmptyTitle>
        <EmptyDescription>{t.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>{t.createProject}</Button>
        <Button variant="outline">{t.importProject}</Button>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          {t.learnMore}{" "}
          <ArrowUpRightIcon className="rtl:rotate-270" data-icon="inline-end" />
        </a>
      </Button>
    </Empty>
  )
}
