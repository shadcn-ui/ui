"use client"

import * as React from "react"

import { type DirectionValue } from "@/registry/config"
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

const DIRECTION_OPTIONS = [
  {
    value: "ltr" as const,
    label: "LTR",
    description: "Left-to-Right",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        stroke="currentColor"
        className="text-foreground"
      >
        <path
          d="M3 12h18M15 6l6 6-6 6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "rtl" as const,
    label: "RTL",
    description: "Right-to-Left",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        stroke="currentColor"
        className="text-foreground"
      >
        <path
          d="M21 12H3M9 18l-6-6 6-6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const

export function DirectionPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const currentDirection = DIRECTION_OPTIONS.find(
    (direction) => direction.value === params.direction
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Direction</div>
            <div className="text-foreground text-sm font-medium">
              {currentDirection?.label}
            </div>
          </div>
          <div className="text-foreground pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base select-none">
            {currentDirection?.icon}
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentDirection?.value}
            onValueChange={(value) => {
              setParams({ direction: value as DirectionValue })
            }}
          >
            <PickerGroup>
              {DIRECTION_OPTIONS.map((direction) => (
                <PickerRadioItem key={direction.value} value={direction.value}>
                  {direction.icon}
                  {direction.label}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="direction"
        className="absolute top-1/2 right-10 -translate-y-1/2"
      />
    </div>
  )
}
