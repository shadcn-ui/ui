"use client"

import * as React from "react"

import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerLabel,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

type FontPickerOption = {
  name: string
  value: string
  type: string
  font: {
    style: {
      fontFamily: string
    }
  } | null
}

export function FontPicker({
  label,
  param,
  fonts,
  isMobile,
  anchorRef,
}: {
  label: string
  param: "font" | "fontHeading"
  fonts: readonly FontPickerOption[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const currentValue = param === "font" ? params.font : params.fontHeading
  const handleFontChange = React.useCallback(
    (value: string) => {
      setParams({
        [param]: value,
      } as Partial<DesignSystemSearchParams>)
    },
    [param, setParams]
  )

  const currentFont = React.useMemo(
    () => fonts.find((font) => font.value === currentValue),
    [fonts, currentValue]
  )
  const currentBodyFont = React.useMemo(
    () => FONTS.find((font) => font.value === params.font),
    [params.font]
  )
  const inheritsBodyFont = param === "fontHeading" && currentValue === "inherit"
  const displayFontName = inheritsBodyFont
    ? currentBodyFont?.name
    : currentFont?.name
  const inheritFontLabel = currentBodyFont ? currentBodyFont.name : "Body font"
  const groupedFonts = React.useMemo(() => {
    const pickerFonts =
      param === "fontHeading"
        ? fonts.filter((font) => font.value !== "inherit")
        : fonts
    const groups = new Map<string, FontPickerOption[]>()

    for (const font of pickerFonts) {
      const existing = groups.get(font.type)
      if (existing) {
        existing.push(font)
        continue
      }

      groups.set(font.type, [font])
    }

    return Array.from(groups.entries()).map(([type, items]) => ({
      type,
      label: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
      items,
    }))
  }, [fonts, param])

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium text-foreground">
              {displayFontName}
            </div>
          </div>
          <div
            className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5"
            style={{
              fontFamily:
                currentFont?.font?.style.fontFamily ??
                currentBodyFont?.font.style.fontFamily,
            }}
          >
            Aa
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          className="max-h-96"
        >
          <PickerRadioGroup
            value={currentValue}
            onValueChange={handleFontChange}
          >
            {param === "fontHeading" ? (
              <>
                <PickerGroup>
                  <PickerRadioItem value="inherit" closeOnClick={isMobile}>
                    {inheritFontLabel}
                  </PickerRadioItem>
                </PickerGroup>
                <PickerSeparator />
              </>
            ) : null}
            {groupedFonts.map((group) => (
              <PickerGroup key={group.type}>
                <PickerLabel>{group.label}</PickerLabel>
                {group.items.map((font) => (
                  <PickerRadioItem
                    key={font.value}
                    value={font.value}
                    closeOnClick={isMobile}
                  >
                    {font.name}
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
