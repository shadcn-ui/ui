"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { Style } from "@/registry/styles"
import {
  CustomizerItem,
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(design)/design/components/customizer"
import { designSystemSearchParams } from "@/app/(design)/design/lib/search-params"

export function StylePicker({ styles }: { styles: readonly Style[] }) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  const handleSelect = React.useCallback(
    (styleName: Style["name"]) => {
      setParams({ style: styleName })
      setOpen(false)
    },
    [setParams]
  )

  return (
    <CustomizerItem
      title="Style"
      description={styles.find((style) => style.name === params.style)?.title}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <CustomizerPicker
        currentValue={
          styles.find((style) => style.name === params.style)?.title ?? null
        }
        open={open}
      >
        <CustomizerPickerGroup className="pb-3.5">
          {styles.map((style) => (
            <CustomizerPickerItem
              key={style.name}
              value={style.title}
              onSelect={() => handleSelect(style.name)}
              isActive={style.name === params.style}
            >
              {style.title}
            </CustomizerPickerItem>
          ))}
        </CustomizerPickerGroup>
      </CustomizerPicker>
    </CustomizerItem>
  )
}
