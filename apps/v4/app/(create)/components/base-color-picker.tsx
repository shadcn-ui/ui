"use client"

import * as React from "react"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type BaseColorName } from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function BaseColorPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()

  const currentBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.baseColor),
    [params.baseColor]
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Base Color</div>
            <div className="text-sm font-medium text-foreground">
              {currentBaseColor?.title}
            </div>
          </div>
          {mounted && (
            <div
              style={
                {
                  "--color":
                    currentBaseColor?.cssVars?.dark?.["muted-foreground"],
                } as React.CSSProperties
              }
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full bg-(--color) select-none md:right-2.5"
            />
          )}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentBaseColor?.name}
            onValueChange={(value) => {
              setParams({ baseColor: value as BaseColorName })
            }}
          >
            <PickerGroup>
              {BASE_COLORS.map((baseColor) => (
                <PickerRadioItem
                  key={baseColor.name}
                  value={baseColor.name}
                  closeOnClick={isMobile}
                >
                  {baseColor.title}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="baseColor"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
