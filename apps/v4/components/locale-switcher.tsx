"use client"

import { cn } from "@/lib/utils"
import { useLocale } from "@/hooks/use-locale"
import { LanguageSelector } from "@/components/language-selector"

export function LocaleSwitcher({ className }: React.ComponentProps<"div">) {
  const { language, setLanguage } = useLocale()

  return (
    <div className={cn("flex items-center", className)}>
      <LanguageSelector value={language} onValueChange={setLanguage} />
    </div>
  )
}
