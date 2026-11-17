"use client"

import * as React from "react"
import { CursorMagicSelection03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BUTTON_FEEDBACKS, type ButtonFeedbackValue } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(app)/(create)/components/picker"
import { usePreviewOverride } from "@/app/(app)/(create)/components/preview-override"
import { useDesignSystemSearchParams } from "@/app/(app)/(create)/lib/search-params"

export function ButtonFeedbackPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { setOverride, clearOverride } = usePreviewOverride()
  const currentStyle = BUTTON_FEEDBACKS.find(
    (style) => style.value === params.buttonFeedback
  )

  const previewStyle = (value: string) => ({
    buttonFeedback: value as ButtonFeedbackValue,
  })

  return (
    <div className="group/picker relative">
      <Picker
        onOpenChange={(open) => {
          if (!open) {
            clearOverride()
          }
        }}
      >
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Button Feedback</div>
            <div className="text-sm font-medium text-foreground">
              {currentStyle?.label}
            </div>
          </div>
          <div className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5">
            <HugeiconsIcon
              icon={CursorMagicSelection03Icon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          onMouseLeave={clearOverride}
        >
          <PickerRadioGroup
            value={params.buttonFeedback}
            onValueChange={(value) => setParams(previewStyle(value))}
            onItemPreview={
              isMobile ? undefined : (value) => setOverride(previewStyle(value))
            }
          >
            <PickerGroup>
              {BUTTON_FEEDBACKS.map((style) => (
                <PickerRadioItem
                  value={style.value}
                  key={style.value}
                  closeOnClick={isMobile}
                >
                  {style.label}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
    </div>
  )
}
