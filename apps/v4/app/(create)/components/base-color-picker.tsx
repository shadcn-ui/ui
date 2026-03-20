"use client"

import * as React from "react"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type BaseColorName } from "@/registry/config"
import { useCustomizerLayout } from "@/app/(create)/components/customizer-layout"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerValueTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function BaseColorPicker({
  isMobile,
  anchorRef,
  collapsed = false,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  collapsed?: boolean
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()
  const { desktopPickerSide } = useCustomizerLayout()

  const currentBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.baseColor),
    [params.baseColor]
  )
  const baseColorIndicator = mounted ? (
    <div
      style={
        {
          "--color": currentBaseColor?.cssVars?.dark?.["muted-foreground"],
        } as React.CSSProperties
      }
      className="size-4 rounded-full bg-(--color)"
    />
  ) : null

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerValueTrigger
          label="Base Color"
          value={currentBaseColor?.title}
          valueText={currentBaseColor?.title}
          indicator={baseColorIndicator}
          collapsed={collapsed}
        />
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : desktopPickerSide}
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
      {!collapsed ? (
        <LockButton
          param="baseColor"
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
