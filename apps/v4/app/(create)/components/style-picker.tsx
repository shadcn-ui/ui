"use client"

import * as React from "react"

import { type Style, type StyleName } from "@/registry/config"
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

export function StylePicker({
  styles,
  isMobile,
  anchorRef,
  collapsed = false,
}: {
  styles: readonly Style[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  collapsed?: boolean
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { desktopPickerSide } = useCustomizerLayout()

  const currentStyle = styles.find((style) => style.name === params.style)
  const currentStyleIcon = currentStyle?.icon
    ? React.cloneElement(currentStyle.icon, {
        className: "size-4",
      })
    : null

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerValueTrigger
          label="Style"
          value={currentStyle?.title}
          valueText={currentStyle?.title}
          indicator={currentStyleIcon}
          collapsed={collapsed}
        />
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : desktopPickerSide}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentStyle?.name}
            onValueChange={(value) => {
              setParams({ style: value as StyleName })
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
      {!collapsed ? (
        <LockButton
          param="style"
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
