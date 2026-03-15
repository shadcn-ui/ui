"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import { ButtonGroup } from "@/examples/base/ui-rtl/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/base/ui-rtl/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui-rtl/tooltip"
import { AudioLinesIcon, PlusIcon } from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    add: "إضافة",
    voicePlaceholder: "سجل وأرسل صوتًا...",
    messagePlaceholder: "أرسل رسالة...",
    voiceMode: "الوضع الصوتي",
  },
  he: {
    dir: "rtl" as const,
    add: "הוסף",
    voicePlaceholder: "הקלט ושלח אודיו...",
    messagePlaceholder: "שלח הודעה...",
    voiceMode: "מצב קולי",
  },
}

export function ButtonGroupInputGroup() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]
  const [voiceEnabled, setVoiceEnabled] = React.useState(false)

  return (
    <ButtonGroup dir={t.dir}>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label={t.add}>
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup>
          <InputGroupInput
            placeholder={
              voiceEnabled ? t.voicePlaceholder : t.messagePlaceholder
            }
            disabled={voiceEnabled}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    data-active={voiceEnabled}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    aria-pressed={voiceEnabled}
                    size="icon-xs"
                    aria-label={t.voiceMode}
                  />
                }
              >
                <AudioLinesIcon />
              </TooltipTrigger>
              <TooltipContent>{t.voiceMode}</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
