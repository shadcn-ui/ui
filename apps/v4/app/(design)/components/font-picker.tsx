"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { type Font } from "@/registry/fonts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function FontPicker({ fonts }: { fonts: readonly Font[] }) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentFont = React.useMemo(
    () => fonts.find((font) => font.value === params.font),
    [fonts, params.font]
  )

  return (
    <Select
      value={currentFont?.value}
      onValueChange={(value) => {
        setParams({ font: value as Font["value"] })
      }}
    >
      <SelectTrigger className="w-full text-left data-[size=default]:h-14">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs font-medium">
              Font
            </div>
            {currentFont?.name}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="right"
        align="start"
        className="w-64"
      >
        {fonts.map((font) => (
          <SelectItem key={font.value} value={font.value}>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs font-medium">
                {font.name}
              </span>
              <span
                className="text-sm"
                style={{ fontFamily: font.font.style.fontFamily }}
              >
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
