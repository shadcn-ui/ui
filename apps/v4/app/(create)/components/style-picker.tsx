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

export function StylePicker({
  styles,
  isMobile,
  anchorRef,
}: {
  styles: readonly Style[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentStyle = styles.find((style) => style.name === params.style)

  return (
    <Picker>
      <PickerTrigger>
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Style</div>
          <div className="text-foreground text-sm font-medium">
            {currentStyle?.title}
          </div>
        </div>
      </PickerTrigger>
      <PickerContent
        anchor={isMobile ? anchorRef : undefined}
        side={isMobile ? "top" : "right"}
        align={isMobile ? "center" : "start"}
      >
        <PickerRadioGroup
          value={currentStyle?.name}
          onValueChange={(value) => {
            setParams({ style: value as StyleName })
          }}
        >
          <PickerGroup>
            {styles.map((style) => (
              <PickerRadioItem key={style.name} value={style.name}>
                {style.title}
              </PickerRadioItem>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
