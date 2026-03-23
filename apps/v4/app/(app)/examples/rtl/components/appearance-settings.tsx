"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import { ButtonGroup } from "@/examples/base/ui-rtl/button-group"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/examples/base/ui-rtl/field"
import { Input } from "@/examples/base/ui-rtl/input"
import { RadioGroup, RadioGroupItem } from "@/examples/base/ui-rtl/radio-group"
import { Switch } from "@/examples/base/ui-rtl/switch"
import { IconMinus, IconPlus } from "@tabler/icons-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    computeEnvironment: "بيئة الحوسبة",
    computeDescription: "اختر بيئة الحوسبة لمجموعتك.",
    kubernetes: "كوبرنيتس",
    kubernetesDescription:
      "تشغيل أحمال عمل GPU على مجموعة مُهيأة بـ K8s. هذا هو الافتراضي.",
    virtualMachine: "جهاز افتراضي",
    vmDescription: "الوصول إلى مجموعة VM مُهيأة لتشغيل أحمال العمل. (قريبًا)",
    numberOfGpus: "عدد وحدات GPU",
    gpuDescription: "يمكنك إضافة المزيد لاحقًا.",
    decrement: "إنقاص",
    increment: "زيادة",
    wallpaperTinting: "تلوين الخلفية",
    wallpaperDescription: "السماح بتلوين الخلفية.",
  },
  he: {
    dir: "rtl" as const,
    computeEnvironment: "סביבת מחשוב",
    computeDescription: "בחר את סביבת המחשוב לאשכול שלך.",
    kubernetes: "קוברנטיס",
    kubernetesDescription:
      "הפעל עומסי עבודה של GPU באשכול מוגדר K8s. זו ברירת המחדל.",
    virtualMachine: "מכונה וירטואלית",
    vmDescription: "גש לאשכול VM מוגדר להפעלת עומסי עבודה. (בקרוב)",
    numberOfGpus: "מספר GPUs",
    gpuDescription: "תוכל להוסיף עוד מאוחר יותר.",
    decrement: "הפחת",
    increment: "הגדל",
    wallpaperTinting: "צביעת טפט",
    wallpaperDescription: "אפשר לטפט להיצבע.",
  },
}

export function AppearanceSettings() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]
  const [gpuCount, setGpuCount] = React.useState(8)

  const handleGpuAdjustment = React.useCallback((adjustment: number) => {
    setGpuCount((prevCount) =>
      Math.max(1, Math.min(99, prevCount + adjustment))
    )
  }, [])

  const handleGpuInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 1 && value <= 99) {
        setGpuCount(value)
      }
    },
    []
  )

  return (
    <div dir={t.dir}>
      <FieldSet>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{t.computeEnvironment}</FieldLegend>
            <FieldDescription>{t.computeDescription}</FieldDescription>
            <RadioGroup defaultValue="kubernetes">
              <FieldLabel htmlFor="rtl-kubernetes">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{t.kubernetes}</FieldTitle>
                    <FieldDescription>
                      {t.kubernetesDescription}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="kubernetes"
                    id="rtl-kubernetes"
                    aria-label={t.kubernetes}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="rtl-vm">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{t.virtualMachine}</FieldTitle>
                    <FieldDescription>{t.vmDescription}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="vm"
                    id="rtl-vm"
                    aria-label={t.virtualMachine}
                  />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="rtl-gpu-count">{t.numberOfGpus}</FieldLabel>
              <FieldDescription>{t.gpuDescription}</FieldDescription>
            </FieldContent>
            <ButtonGroup>
              <Input
                id="rtl-gpu-count"
                value={gpuCount}
                onChange={handleGpuInputChange}
                size={3}
                className="h-7 w-14! font-mono"
                maxLength={3}
              />
              <Button
                variant="outline"
                size="icon-sm"
                type="button"
                aria-label={t.decrement}
                onClick={() => handleGpuAdjustment(-1)}
                disabled={gpuCount <= 1}
              >
                <IconMinus />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                type="button"
                aria-label={t.increment}
                onClick={() => handleGpuAdjustment(1)}
                disabled={gpuCount >= 99}
              >
                <IconPlus />
              </Button>
            </ButtonGroup>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="rtl-tinting">
                {t.wallpaperTinting}
              </FieldLabel>
              <FieldDescription>{t.wallpaperDescription}</FieldDescription>
            </FieldContent>
            <Switch id="rtl-tinting" defaultChecked />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
