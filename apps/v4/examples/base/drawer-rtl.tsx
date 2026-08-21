"use client"

import * as React from "react"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Badge } from "@/styles/base-nova/ui-rtl/badge"
import { Button } from "@/styles/base-nova/ui-rtl/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/styles/base-nova/ui-rtl/drawer"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/styles/base-nova/ui-rtl/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/styles/base-nova/ui-rtl/radio-group"

const translations = {
  en: {
    dir: "ltr",
    locale: "en-US",
    values: {
      trigger: "Open Drawer",
      title: "Pick a delivery time",
      description: "We'll prepare your order as soon as possible.",
      confirm: "Confirm Delivery Time",
      cancel: "Cancel",
      toastTitle: "Delivery time confirmed",
      asapLabel: "Standard delivery",
      asapDescription: "25–35 min · Driver assigned now",
      asapBadge: "Fastest",
      slot500Label: "5:00 PM – 5:15 PM",
      slot500Description: "Prep starts at 4:45 PM",
      slot530Label: "5:30 PM – 5:45 PM",
      slot530Description: "Good if you're heading home",
      slot600Label: "6:00 PM – 6:15 PM",
      slot600Description: "Most popular · High demand",
      slot630Label: "6:30 PM – 6:45 PM",
      slot630Description: "Last slot before kitchen closes",
    },
  },
  ar: {
    dir: "rtl",
    locale: "ar-EG",
    values: {
      trigger: "فتح الدرج",
      title: "اختر وقت التوصيل",
      description: "سنجهز طلبك في أقرب وقت ممكن.",
      confirm: "تأكيد وقت التوصيل",
      cancel: "إلغاء",
      toastTitle: "تم تأكيد وقت التوصيل",
      asapLabel: "توصيل قياسي",
      asapDescription: "25–35 دقيقة · تم تعيين السائق الآن",
      asapBadge: "الأسرع",
      slot500Label: "5:00 م – 5:15 م",
      slot500Description: "يبدأ التحضير في 4:45 م",
      slot530Label: "5:30 م – 5:45 م",
      slot530Description: "مناسب إذا كنت في الطريق إلى المنزل",
      slot600Label: "6:00 م – 6:15 م",
      slot600Description: "الأكثر شيوعًا · طلب مرتفع",
      slot630Label: "6:30 م – 6:45 م",
      slot630Description: "آخر موعد قبل إغلاق المطبخ",
    },
  },
  he: {
    dir: "rtl",
    locale: "he-IL",
    values: {
      trigger: "פתח מגירה",
      title: "בחר זמן משלוח",
      description: "נכין את ההזמנה שלך בהקדם האפשרי.",
      confirm: "אשר זמן משלוח",
      cancel: "בטל",
      toastTitle: "זמן המשלוח אושר",
      asapLabel: "משלוח רגיל",
      asapDescription: "25–35 דק׳ · נהג הוקצה כעת",
      asapBadge: "הכי מהיר",
      slot500Label: "17:00 – 17:15",
      slot500Description: "ההכנה מתחילה ב-16:45",
      slot530Label: "17:30 – 17:45",
      slot530Description: "מתאים אם אתה בדרך הביתה",
      slot600Label: "18:00 – 18:15",
      slot600Description: "הפופולרי ביותר · ביקוש גבוה",
      slot630Label: "18:30 – 18:45",
      slot630Description: "המשבצת האחרונה לפני סגירת המטבח",
    },
  },
} satisfies Translations

type TranslationKey = keyof typeof translations.en.values

const deliveryTimes: Array<{
  value: string
  id: string
  labelKey: TranslationKey
  descriptionKey: TranslationKey
  badgeKey?: TranslationKey
}> = [
  {
    value: "asap",
    id: "delivery-asap-rtl",
    labelKey: "asapLabel",
    descriptionKey: "asapDescription",
    badgeKey: "asapBadge",
  },
  {
    value: "5-00",
    id: "delivery-5-00-rtl",
    labelKey: "slot500Label",
    descriptionKey: "slot500Description",
  },
  {
    value: "5-30",
    id: "delivery-5-30-rtl",
    labelKey: "slot530Label",
    descriptionKey: "slot530Description",
  },
  {
    value: "6-00",
    id: "delivery-6-00-rtl",
    labelKey: "slot600Label",
    descriptionKey: "slot600Description",
  },
  {
    value: "6-30",
    id: "delivery-6-30-rtl",
    labelKey: "slot630Label",
    descriptionKey: "slot630Description",
  },
]

export function DrawerRtl() {
  const { dir, language, t } = useTranslation(translations, "ar")
  const [open, setOpen] = React.useState(false)
  const [deliveryTime, setDeliveryTime] = React.useState("asap")
  const isMobile = useIsMobile()

  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime)

    if (!selected) {
      return
    }

    setOpen(false)
    toast(t.toastTitle, {
      description: t[selected.labelKey],
    })
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger render={<Button variant="secondary" />}>
        {t.trigger}
      </DrawerTrigger>
      <DrawerContent dir={dir} data-lang={dir === "rtl" ? language : undefined}>
        <DrawerHeader>
          <DrawerTitle>{t.title}</DrawerTitle>
          <DrawerDescription>{t.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4">
          <RadioGroup
            value={deliveryTime}
            onValueChange={setDeliveryTime}
            className="gap-2"
            dir={dir}
          >
            {deliveryTimes.map((time) => (
              <FieldLabel key={time.value} htmlFor={time.id} dir={dir}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex items-center gap-2">
                      {t[time.labelKey]}
                      {time.badgeKey ? (
                        <Badge variant="secondary">{t[time.badgeKey]}</Badge>
                      ) : null}
                    </FieldTitle>
                    <FieldDescription dir={dir}>
                      {t[time.descriptionKey]}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={time.value} id={time.id} dir={dir} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </div>
        <DrawerFooter>
          <Button onClick={handleConfirm} className="h-[34px]">
            {t.confirm}
          </Button>
          <DrawerClose render={<Button variant="outline" />}>
            {t.cancel}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
