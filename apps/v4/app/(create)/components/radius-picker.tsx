"use client"

import { useQueryStates } from "nuqs"

import { RADII, type RadiusValue } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function RadiusPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentRadius = RADII.find((radius) => radius.name === params.radius)
  const defaultRadius = RADII.find((radius) => radius.name === "default")
  const otherRadii = RADII.filter((radius) => radius.name !== "default")

  return (
    <Picker>
      <PickerTrigger className="hover:bg-muted data-popup-open:bg-muted relative rounded-lg p-2">
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Radius</div>
          <div className="text-foreground text-sm font-medium">
            {currentRadius?.label}
          </div>
        </div>
        <div className="text-foreground absolute top-1/2 right-4 ml-auto flex size-4 -translate-y-1/2 rotate-90 items-center justify-center text-base">
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
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1"
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
                className="rounded-lg"
              >
                <div className="flex flex-col justify-start">
                  <div>{defaultRadius.label}</div>
                  <div className="text-muted-foreground text-xs">
                    Use radius from style
                  </div>
                </div>
              </PickerRadioItem>
            )}
          </PickerGroup>
          <PickerSeparator />
          <PickerGroup>
            {otherRadii.map((radius) => (
              <PickerRadioItem
                key={radius.name}
                value={radius.name}
                className="rounded-lg"
              >
                {radius.label}
              </PickerRadioItem>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
