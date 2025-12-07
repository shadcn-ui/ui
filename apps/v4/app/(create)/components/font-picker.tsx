"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { type FontValue } from "@/registry/config"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { type Font } from "@/app/(create)/lib/fonts"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

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
        setParams({ font: value as FontValue })
      }}
    >
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Font</div>
            <div className="text-foreground text-sm font-medium">
              {currentFont?.name}
            </div>
          </div>
          <div
            className="text-foreground absolute top-1/2 right-4 ml-auto flex size-4 -translate-y-1/2 items-center justify-center text-base"
            style={{ fontFamily: currentFont?.font.style.fontFamily }}
          >
            Aa
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 h-96 w-64 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        <SelectGroup>
          {fonts.map((font) => (
            <React.Fragment key={font.value}>
              <SelectItem value={font.value} className="rounded-lg">
                <Item size="xs">
                  <ItemContent className="gap-1">
                    <ItemTitle className="text-muted-foreground text-xs font-medium">
                      {font.name}
                    </ItemTitle>
                    <ItemDescription
                      style={{ fontFamily: font.font.style.fontFamily }}
                    >
                      Designers love packing quirky glyphs into test phrases.
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </SelectItem>
              <SelectSeparator className="opacity-50 last:hidden" />
            </React.Fragment>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
