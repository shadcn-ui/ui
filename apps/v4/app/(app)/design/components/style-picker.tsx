"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { Style } from "@/registry/styles"
import {
  ToolbarItem,
  ToolbarPicker,
  ToolbarPickerGroup,
  ToolbarPickerItem,
} from "@/app/(app)/design/components/toolbar"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

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
    <ToolbarItem
      title="Style"
      description={styles.find((style) => style.name === params.style)?.title}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <ToolbarPicker
        currentValue={
          styles.find((style) => style.name === params.style)?.title ?? null
        }
        open={open}
      >
        <ToolbarPickerGroup>
          {styles.map((style) => (
            <ToolbarPickerItem
              key={style.name}
              value={style.title}
              onSelect={() => handleSelect(style.name)}
              isActive={style.name === params.style}
            >
              {style.title}
            </ToolbarPickerItem>
          ))}
        </ToolbarPickerGroup>
      </ToolbarPicker>
    </ToolbarItem>
  )
}
