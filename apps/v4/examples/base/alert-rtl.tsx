"use client"

import * as React from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/examples/base/ui-rtl/alert"
import { CheckCircle2Icon, InfoIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      paymentTitle: "Payment successful",
      paymentDescription:
        "Your payment of $29.99 has been processed. A receipt has been sent to your email address.",
      featureTitle: "New feature available",
      featureDescription:
        "We've added dark mode support. You can enable it in your account settings.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      paymentTitle: "تم الدفع بنجاح",
      paymentDescription:
        "تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.",
      featureTitle: "ميزة جديدة متاحة",
      featureDescription:
        "لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      paymentTitle: "התשלום בוצע בהצלחה",
      paymentDescription:
        "התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.",
      featureTitle: "תכונה חדשה זמינה",
      featureDescription:
        "הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.",
    },
  },
}

const alerts = [
  {
    icon: CheckCircle2Icon,
    titleKey: "paymentTitle" as const,
    descriptionKey: "paymentDescription" as const,
  },
  {
    icon: InfoIcon,
    titleKey: "featureTitle" as const,
    descriptionKey: "featureDescription" as const,
  },
] as const

export function AlertRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="grid w-full max-w-md items-start gap-4" dir={dir}>
      {alerts.map((alert, index) => {
        const Icon = alert.icon
        return (
          <Alert key={index}>
            <Icon />
            <AlertTitle>{t[alert.titleKey]}</AlertTitle>
            <AlertDescription>{t[alert.descriptionKey]}</AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
