"use client"

import { useQueryStates } from "nuqs"

import { type Style, type StyleName } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function StylePicker({ styles }: { styles: readonly Style[] }) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentStyle = styles.find((style) => style.name === params.style)

  return (
    <Picker>
      <PickerTrigger className="hover:bg-muted data-popup-open:bg-muted relative rounded-lg p-2">
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Style</div>
          <div className="text-foreground text-sm font-medium">
            {currentStyle?.title}
          </div>
        </div>
      </PickerTrigger>
      <PickerContent
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1"
      >
        <PickerRadioGroup
          value={currentStyle?.name}
          onValueChange={(value) => {
            setParams({ style: value as StyleName })
          }}
        >
          <PickerGroup>
            {styles.map((style) => (
              <PickerRadioItem
                key={style.name}
                value={style.name}
                className="rounded-lg"
              >
                {style.title}
              </PickerRadioItem>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
