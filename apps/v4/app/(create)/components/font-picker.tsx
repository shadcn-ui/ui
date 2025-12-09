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
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
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
    <Picker>
      <PickerTrigger className="hover:bg-muted data-popup-open:bg-muted relative rounded-lg p-2">
        <div className="flex flex-col justify-start text-left">
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
      </PickerTrigger>
      <PickerContent
        side="left"
        align="start"
        className="ring-foreground/10 h-96 w-64 rounded-xl border-0 ring-1"
      >
        <PickerRadioGroup
          value={currentFont?.value}
          onValueChange={(value) => {
            setParams({ font: value as FontValue })
          }}
        >
          <PickerGroup>
            {fonts.map((font, index) => (
              <React.Fragment key={font.value}>
                <PickerRadioItem value={font.value} className="rounded-lg">
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
                </PickerRadioItem>
                {index < fonts.length - 1 && (
                  <PickerSeparator className="opacity-50" />
                )}
              </React.Fragment>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
