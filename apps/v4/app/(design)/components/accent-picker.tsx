"use client"

import { useQueryStates } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

const ACCENT_OPTIONS = [
  { value: "subtle" as const, label: "Subtle" },
  { value: "bold" as const, label: "Bold" },
] as const

export function AccentPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentAccent = ACCENT_OPTIONS.find(
    (accent) => accent.value === params.accent
  )

  return (
    <Select
      value={currentAccent?.value}
      onValueChange={(value) => {
        setParams({ accent: value as "subtle" | "bold" })
      }}
    >
      <SelectTrigger>
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Accent</div>
            <div className="text-foreground text-sm font-medium">
              {currentAccent?.label}
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="right"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {ACCENT_OPTIONS.map((accent) => (
          <SelectItem
            key={accent.value}
            value={accent.value}
            className="rounded-lg"
          >
            {accent.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
