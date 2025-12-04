"use client"

import { SquareArrowHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

const SPACING_OPTIONS = [
  { value: "default" as const, label: "Default" },
  { value: "compact" as const, label: "Compact" },
] as const

export function SpacingPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentSpacing = SPACING_OPTIONS.find(
    (spacing) => spacing.value === params.spacing
  )

  return (
    <Select
      value={currentSpacing?.value}
      onValueChange={(value) => {
        setParams({ spacing: value as "default" | "compact" })
      }}
    >
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Spacing</div>
            <div className="text-foreground text-sm font-medium">
              {currentSpacing?.label}
            </div>
          </div>
          <div className="text-foreground absolute top-1/2 right-4 ml-auto flex size-4 -translate-y-1/2 items-center justify-center text-base">
            <HugeiconsIcon
              icon={SquareArrowHorizontalIcon}
              className="text-foreground"
            />
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {SPACING_OPTIONS.map((spacing) => (
          <SelectItem
            key={spacing.value}
            value={spacing.value}
            className="rounded-lg"
          >
            {spacing.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
