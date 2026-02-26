"use client"

import { RADII, type RadiusValue } from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function RadiusPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()

  const currentRadius = RADII.find((radius) => radius.name === params.radius)
  const defaultRadius = RADII.find((radius) => radius.name === "default")
  const otherRadii = RADII.filter((radius) => radius.name !== "default")

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Radius</div>
            <div className="text-foreground text-sm font-medium">
              {currentRadius?.label}
            </div>
          </div>
          <div className="text-foreground pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 rotate-90 items-center justify-center text-base select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="text-foreground"
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
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentRadius?.name}
            onValueChange={(value) => {
              setParams({ radius: value as RadiusValue })
            }}
          >
            <PickerGroup>
              {defaultRadius && (
                <PickerRadioItem
                  key={defaultRadius.name}
                  value={defaultRadius.name}
                >
                  <div className="flex flex-col justify-start pointer-coarse:gap-1">
                    <div>{defaultRadius.label}</div>
                    <div className="text-muted-foreground text-xs pointer-coarse:text-sm">
                      Use radius from style
                    </div>
                  </div>
                </PickerRadioItem>
              )}
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              {otherRadii.map((radius) => (
                <PickerRadioItem key={radius.name} value={radius.name}>
                  {radius.label}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="radius"
        className="absolute top-1/2 right-10 -translate-y-1/2"
      />
    </div>
  )
}
