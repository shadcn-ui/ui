"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/examples/base/ui-rtl/avatar"
import { Button } from "@/examples/base/ui-rtl/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/examples/base/ui-rtl/empty"
import { PlusIcon } from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    title: "لا يوجد أعضاء في الفريق",
    description: "قم بدعوة فريقك للتعاون في هذا المشروع.",
    invite: "دعوة أعضاء",
  },
  he: {
    dir: "rtl" as const,
    title: "אין חברי צוות",
    description: "הזמן את הצוות שלך לשתף פעולה בפרויקט זה.",
    invite: "הזמן חברים",
  },
}

export function EmptyAvatarGroup() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]

  return (
    <Empty className="flex-none border py-10" dir={t.dir}>
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup className="grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>{t.title}</EmptyTitle>
        <EmptyDescription>{t.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          {t.invite}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
