"use client"

import * as React from "react"

import { PRESETS, type Style, type StyleName } from "@/registry/config"
import { LockButton } from "@/app/(app)/create/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(app)/create/components/picker"
import { useDesignSystemSearchParams } from "@/app/(app)/create/lib/search-params"

export function StylePicker({
  styles,
  isMobile,
  anchorRef,
}: {
  styles: readonly Style[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()

  const currentStyle = styles.find((style) => style.name === params.style)

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Style</div>
            <div className="text-sm font-medium text-foreground">
              {currentStyle?.title}
            </div>
          </div>
          {currentStyle?.icon && (
            <div className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center select-none md:right-2.5">
              {React.cloneElement(currentStyle.icon, {
                className: "size-4",
              })}
            </div>
          )}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentStyle?.name}
            onValueChange={(value) => {
              const styleName = value as StyleName
              const preset = PRESETS.find(
                (p) => p.base === params.base && p.style === styleName
              )
              setParams({
                style: styleName,
                ...(preset && {
                  baseColor: preset.baseColor,
                  theme: preset.theme,
                  chartColor: preset.chartColor,
                  iconLibrary: preset.iconLibrary,
                  font: preset.font,
                  fontHeading: preset.fontHeading,
                  menuAccent: preset.menuAccent,
                  menuColor: preset.menuColor,
                  radius: preset.radius,
                }),
              })
            }}
          >
            <PickerGroup>
              {styles.map((style) => (
                <PickerRadioItem
                  value={style.name}
                  key={style.name}
                  closeOnClick={isMobile}
                >
                  {style.title}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="style"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
