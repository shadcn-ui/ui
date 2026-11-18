"use client"

import { LockButton } from "@/app/(app)/(typeset)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerLabel,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(app)/(typeset)/components/picker"
import { usePreviewOverride } from "@/app/(app)/(typeset)/components/preview-override"
import { findFont, FONTS } from "@/app/(app)/(typeset)/lib/fonts"
import {
  coerceTypesetValue,
  useTypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

export function FontPicker({
  label,
  param,
  isMobile,
  anchorRef,
}: {
  label: string
  param: "body" | "heading" | "mono"
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useTypesetSearchParams()
  const { setOverride, clearOverride } = usePreviewOverride()
  const currentValue =
    param === "body"
      ? params.body
      : param === "heading"
        ? params.heading
        : params.mono
  const bodyFont = findFont(params.body) ?? FONTS[0]
  const inheritsBodyFont = param === "heading" && currentValue === "inherit"
  const currentFont = inheritsBodyFont
    ? bodyFont
    : (findFont(currentValue) ?? bodyFont)

  // Every picker offers every font (no type filter); grouping is just labels.
  const groupedFonts = [
    { label: "Sans", fonts: FONTS.filter((f) => f.type === "sans") },
    { label: "Serif", fonts: FONTS.filter((f) => f.type === "serif") },
    { label: "Mono", fonts: FONTS.filter((f) => f.type === "mono") },
  ]

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
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="line-clamp-1 max-w-[80%] truncate text-sm font-medium text-foreground">
              {currentFont.label}
            </div>
          </div>
          <div
            className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5"
            style={{ fontFamily: currentFont.value }}
          >
            Aa
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          className="max-h-96"
          onMouseLeave={clearOverride}
        >
          <PickerRadioGroup
            value={currentValue}
            onValueChange={(next) => {
              if (param === "body") {
                const value = coerceTypesetValue("body", next)
                if (value !== null) setParams({ body: value })
              } else if (param === "heading") {
                const value = coerceTypesetValue("heading", next)
                if (value !== null) setParams({ heading: value })
              } else {
                const value = coerceTypesetValue("mono", next)
                if (value !== null) setParams({ mono: value })
              }
            }}
            onItemPreview={
              isMobile
                ? undefined
                : (next) => {
                    const value = coerceTypesetValue(param, next)
                    if (value !== null) {
                      setOverride({ [param]: value })
                    }
                  }
            }
          >
            {param === "heading" ? (
              <>
                <PickerGroup>
                  <PickerRadioItem value="inherit">
                    {bodyFont.label}
                  </PickerRadioItem>
                </PickerGroup>
                <PickerSeparator />
              </>
            ) : null}
            {groupedFonts.map((group) => (
              <PickerGroup key={group.label}>
                <PickerLabel>{group.label}</PickerLabel>
                {group.fonts.map((font) => (
                  <PickerRadioItem key={font.id} value={font.id}>
                    {font.label}
                  </PickerRadioItem>
                ))}
              </PickerGroup>
            ))}
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param={param}
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
