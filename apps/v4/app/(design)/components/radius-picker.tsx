"use client"

import { useQueryStates } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { RADII, type RadiusValue } from "@/app/(design)/lib/config"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function RadiusPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentRadius = RADII.find((radius) => radius.value === params.radius)

  return (
    <Select
      value={currentRadius?.value}
      onValueChange={(value) => {
        setParams({ radius: value as RadiusValue })
      }}
    >
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
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
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {RADII.map((radius) => (
          <SelectItem
            key={radius.value}
            value={radius.value}
            className="rounded-lg"
          >
            {radius.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
