"use client"

import * as React from "react"
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

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const months = [
  { label: "MM", value: null },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
  { label: "04", value: "04" },
  { label: "05", value: "05" },
  { label: "06", value: "06" },
  { label: "07", value: "07" },
  { label: "08", value: "08" },
  { label: "09", value: "09" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
]

const years = [
  { label: "YYYY", value: null },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
]

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      paymentMethod: "Payment Method",
      secureTransactions: "All transactions are secure and encrypted",
      nameOnCard: "Name on Card",
      cardNumber: "Card Number",
      cardNumberDescription: "Enter your 16-digit card number",
      month: "Month",
      year: "Year",
      cvv: "CVV",
      monthPlaceholder: "MM",
      month01: "01",
      month02: "02",
      month03: "03",
      month04: "04",
      month05: "05",
      month06: "06",
      month07: "07",
      month08: "08",
      month09: "09",
      month10: "10",
      month11: "11",
      month12: "12",
      billingAddress: "Billing Address",
      billingAddressDescription:
        "The billing address associated with your payment method",
      sameAsShipping: "Same as shipping address",
      comments: "Comments",
      commentsPlaceholder: "Add any additional comments",
      submit: "Submit",
      cancel: "Cancel",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      paymentMethod: "طريقة الدفع",
      secureTransactions: "جميع المعاملات آمنة ومشفرة",
      nameOnCard: "الاسم على البطاقة",
      cardNumber: "رقم البطاقة",
      cardNumberDescription: "أدخل رقم البطاقة المكون من 16 رقمًا",
      month: "الشهر",
      year: "السنة",
      cvv: "CVV",
      monthPlaceholder: "ش.ش",
      month01: "٠١",
      month02: "٠٢",
      month03: "٠٣",
      month04: "٠٤",
      month05: "٠٥",
      month06: "٠٦",
      month07: "٠٧",
      month08: "٠٨",
      month09: "٠٩",
      month10: "١٠",
      month11: "١١",
      month12: "١٢",
      billingAddress: "عنوان الفوترة",
      billingAddressDescription: "عنوان الفوترة المرتبط بطريقة الدفع الخاصة بك",
      sameAsShipping: "نفس عنوان الشحن",
      comments: "تعليقات",
      commentsPlaceholder: "أضف أي تعليقات إضافية",
      submit: "إرسال",
      cancel: "إلغاء",
    },
  },
  he: {
    dir: "rtl",
    values: {
      paymentMethod: "אמצעי תשלום",
      secureTransactions: "כל העסקאות מאובטחות ומוצפנות",
      nameOnCard: "שם על הכרטיס",
      cardNumber: "מספר כרטיס",
      cardNumberDescription: "הזן את מספר הכרטיס בן 16 הספרות שלך",
      month: "חודש",
      year: "שנה",
      cvv: "CVV",
      monthPlaceholder: "MM",
      month01: "01",
      month02: "02",
      month03: "03",
      month04: "04",
      month05: "05",
      month06: "06",
      month07: "07",
      month08: "08",
      month09: "09",
      month10: "10",
      month11: "11",
      month12: "12",
      billingAddress: "כתובת חיוב",
      billingAddressDescription: "כתובת החיוב המשויכת לאמצעי התשלום שלך",
      sameAsShipping: "זהה לכתובת המשלוח",
      comments: "הערות",
      commentsPlaceholder: "הוסף הערות נוספות",
      submit: "שלח",
      cancel: "בטל",
    },
  },
}

export function FieldRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  const getMonthLabel = (value: string | null): string => {
    if (value === null) return t.monthPlaceholder
    const monthKey = `month${value}` as keyof typeof t
    return t[monthKey] || value
  }

  return (
    <div className="w-full max-w-md py-6" dir={dir}>
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{t.paymentMethod}</FieldLegend>
            <FieldDescription>{t.secureTransactions}</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j-rtl">
                  {t.nameOnCard}
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j-rtl"
                  placeholder="Evil Rabbit"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1-rtl">
                  {t.cardNumber}
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1-rtl"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>{t.cardNumberDescription}</FieldDescription>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="checkout-exp-month-ts6-rtl">
                    {t.month}
                  </FieldLabel>
                  <Select items={months}>
                    <SelectTrigger id="checkout-exp-month-ts6-rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectGroup>
                        {months.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {getMonthLabel(item.value)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59-rtl">
                    {t.year}
                  </FieldLabel>
                  <Select items={years}>
                    <SelectTrigger id="checkout-7j9-exp-year-f59-rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
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
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-cvv-rtl">
                    {t.cvv}
                  </FieldLabel>
                  <Input id="checkout-7j9-cvv-rtl" placeholder="123" required />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>{t.billingAddress}</FieldLegend>
            <FieldDescription>{t.billingAddressDescription}</FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="checkout-7j9-same-as-shipping-wgm-rtl"
                  defaultChecked
                />
                <FieldLabel
                  htmlFor="checkout-7j9-same-as-shipping-wgm-rtl"
                  className="font-normal"
                >
                  {t.sameAsShipping}
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-optional-comments-rtl">
                  {t.comments}
                </FieldLabel>
                <Textarea
                  id="checkout-7j9-optional-comments-rtl"
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
