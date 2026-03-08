"use client"

import * as React from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/base/ui-rtl/input-group"
import { Label } from "@/examples/base/ui-rtl/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/base/ui-rtl/popover"
import { IconInfoCircle, IconStar } from "@tabler/icons-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    inputLabel: "السعر",
    info: "معلومات",
    priceInfo: "أدخل السعر بالريال السعودي.",
    priceDescription: "سيتم تحويل السعر تلقائياً.",
    favorite: "مفضل",
    currency: "ر.س",
  },
  he: {
    dir: "rtl" as const,
    inputLabel: "מחיר",
    info: "מידע",
    priceInfo: "הזן את המחיר בשקלים.",
    priceDescription: "המחיר יומר אוטומטית.",
    favorite: "מועדף",
    currency: "₪",
  },
}

export function InputGroupButtonExample() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]
  const [isFavorite, setIsFavorite] = React.useState(false)

  return (
    <div dir={t.dir} className="grid w-full max-w-sm gap-6">
      <Label htmlFor="input-secure-rtl" className="sr-only">
        {t.inputLabel}
      </Label>
      <InputGroup className="[--radius:9999px]">
        <InputGroupInput id="input-secure-rtl" className="pr-0.5!" />
        <InputGroupAddon>
          <Popover>
            <PopoverTrigger
              render={
                <InputGroupButton
                  variant="secondary"
                  size="icon-xs"
                  aria-label={t.info}
                />
              }
            >
              <IconInfoCircle />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              alignOffset={10}
              className="flex flex-col gap-1 rounded-xl text-sm"
              data-lang={lang}
              dir={t.dir}
            >
              <p className="font-medium">{t.priceInfo}</p>
              <p>{t.priceDescription}</p>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
        <InputGroupAddon className="text-muted-foreground">
          {t.currency}
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setIsFavorite(!isFavorite)}
            size="icon-xs"
            aria-label={t.favorite}
          >
            <IconStar
              data-favorite={isFavorite}
              className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
