"use client"

import { Button } from "@/examples/base/ui-rtl/button"
import { Checkbox } from "@/examples/base/ui-rtl/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/examples/base/ui-rtl/field"
import { Input } from "@/examples/base/ui-rtl/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui-rtl/select"
import { Textarea } from "@/examples/base/ui-rtl/textarea"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    locale: "ar-SA",
    paymentMethod: "طريقة الدفع",
    secureEncrypted: "جميع المعاملات آمنة ومشفرة",
    nameOnCard: "الاسم على البطاقة",
    namePlaceholder: "أحمد محمد",
    cardNumber: "رقم البطاقة",
    cardDescription: "أدخل رقمك المكون من 16 رقمًا.",
    cvv: "رمز الأمان",
    month: "الشهر",
    year: "السنة",
    billingAddress: "عنوان الفواتير",
    billingDescription: "عنوان الفواتير المرتبط بطريقة الدفع الخاصة بك",
    sameAsShipping: "نفس عنوان الشحن",
    comments: "تعليقات",
    commentsPlaceholder: "أضف أي تعليقات إضافية",
    submit: "إرسال",
    cancel: "إلغاء",
  },
  he: {
    dir: "rtl" as const,
    locale: "he-IL",
    paymentMethod: "אמצעי תשלום",
    secureEncrypted: "כל העסקאות מאובטחות ומוצפנות",
    nameOnCard: "שם על הכרטיס",
    namePlaceholder: "ישראל ישראלי",
    cardNumber: "מספר כרטיס",
    cardDescription: "הזן את המספר בן 16 הספרות שלך.",
    cvv: "קוד אבטחה",
    month: "חודש",
    year: "שנה",
    billingAddress: "כתובת לחיוב",
    billingDescription: "כתובת החיוב המשויכת לאמצעי התשלום שלך",
    sameAsShipping: "זהה לכתובת המשלוח",
    comments: "הערות",
    commentsPlaceholder: "הוסף הערות נוספות",
    submit: "שלח",
    cancel: "ביטול",
  },
}

function formatCardNumber(locale: string) {
  const formatter = new Intl.NumberFormat(locale, { useGrouping: false })
  return `${formatter.format(1234)} ${formatter.format(5678)} ${formatter.format(9012)} ${formatter.format(3456)}`
}

function formatCvv(locale: string) {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(123)
}

function getMonths(locale: string) {
  const formatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  return Array.from({ length: 12 }, (_, i) => {
    const value = String(i + 1).padStart(2, "0")
    return { label: formatter.format(i + 1), value }
  })
}

function getYears(locale: string) {
  const formatter = new Intl.NumberFormat(locale, { useGrouping: false })
  return Array.from({ length: 6 }, (_, i) => {
    const year = 2024 + i
    return { label: formatter.format(year), value: String(year) }
  })
}

export function FieldDemo() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]
  const months = getMonths(t.locale)
  const years = getYears(t.locale)
  const cardPlaceholder = formatCardNumber(t.locale)
  const cvvPlaceholder = formatCvv(t.locale)

  return (
    <div dir={t.dir} className="w-full max-w-md rounded-lg border p-6">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{t.paymentMethod}</FieldLegend>
            <FieldDescription>{t.secureEncrypted}</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="rtl-card-name">{t.nameOnCard}</FieldLabel>
                <Input
                  id="rtl-card-name"
                  placeholder={t.namePlaceholder}
                  required
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field className="col-span-2">
                  <FieldLabel htmlFor="rtl-card-number">
                    {t.cardNumber}
                  </FieldLabel>
                  <Input
                    id="rtl-card-number"
                    placeholder={cardPlaceholder}
                    required
                  />
                  <FieldDescription>{t.cardDescription}</FieldDescription>
                </Field>
                <Field className="col-span-1">
                  <FieldLabel htmlFor="rtl-cvv">{t.cvv}</FieldLabel>
                  <Input id="rtl-cvv" placeholder={cvvPlaceholder} required />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="rtl-exp-month">{t.month}</FieldLabel>
                  <Select defaultValue="" items={months}>
                    <SelectTrigger id="rtl-exp-month">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent data-lang={lang} dir={t.dir}>
                      <SelectGroup>
                        {months.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="rtl-exp-year">{t.year}</FieldLabel>
                  <Select defaultValue="" items={years}>
                    <SelectTrigger id="rtl-exp-year">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent data-lang={lang} dir={t.dir}>
                      <SelectGroup>
                        {years.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>{t.billingAddress}</FieldLegend>
            <FieldDescription>{t.billingDescription}</FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="rtl-same-as-shipping" defaultChecked />
                <FieldLabel
                  htmlFor="rtl-same-as-shipping"
                  className="font-normal"
                >
                  {t.sameAsShipping}
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="rtl-comments">{t.comments}</FieldLabel>
                <Textarea
                  id="rtl-comments"
                  placeholder={t.commentsPlaceholder}
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">{t.submit}</Button>
            <Button variant="outline" type="button">
              {t.cancel}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
