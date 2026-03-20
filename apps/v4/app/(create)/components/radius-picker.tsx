"use client"

import * as React from "react"

import { RADII, type RadiusValue } from "@/registry/config"
import { useCustomizerLayout } from "@/app/(create)/components/customizer-layout"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerValueTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function RadiusPicker({
  isMobile,
  anchorRef,
  collapsed = false,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  collapsed?: boolean
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { desktopPickerSide } = useCustomizerLayout()
  const isRadiusLocked = params.style === "lyra"
  const selectedRadiusName = isRadiusLocked ? "none" : params.radius

  const currentRadius = RADII.find(
    (radius) => radius.name === selectedRadiusName
  )
  const defaultRadius = RADII.find((radius) => radius.name === "default")
  const otherRadii = RADII.filter((radius) => radius.name !== "default")

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerValueTrigger
          label="Radius"
          value={currentRadius?.label}
          valueText={currentRadius?.label}
          indicator={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="rotate-90 text-foreground"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 20v-5C4 8.925 8.925 4 15 4h5"
              />
            </svg>
          }
          collapsed={collapsed}
          disabled={isRadiusLocked}
        />
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : desktopPickerSide}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentRadius?.name}
            onValueChange={(value) => {
              if (isRadiusLocked) {
                return
              }
              setParams({ radius: value as RadiusValue })
            }}
          >
            <PickerGroup>
              {defaultRadius && (
                <PickerRadioItem
                  key={defaultRadius.name}
                  value={defaultRadius.name}
                  closeOnClick={isMobile}
                >
                  {defaultRadius.label}
                </PickerRadioItem>
              )}
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              {otherRadii.map((radius) => (
                <PickerRadioItem
                  key={radius.name}
                  value={radius.name}
                  closeOnClick={isMobile}
                >
                  {radius.label}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      {!collapsed ? (
        <LockButton
          param="radius"
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
