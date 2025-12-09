"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { BASES } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function BasePicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentBase = React.useMemo(
    () => BASES.find((base) => base.name === params.base),
    [params.base]
  )

  const handleValueChange = React.useCallback(
    (value: string) => {
      const newBase = BASES.find((base) => base.name === value)
      if (!newBase) {
        return
      }

      setParams({ base: newBase.name })
    },
    [setParams]
  )

  return (
    <Picker>
      <PickerTrigger className="hover:bg-muted data-popup-open:bg-muted relative rounded-lg p-2">
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Component Library</div>
          <div className="text-foreground text-sm font-medium">
            {currentBase?.title}
          </div>
        </div>
        {currentBase?.meta?.logo && (
          <div
            className="text-foreground *:[svg]:text-foreground! absolute top-1/2 right-4 size-4 -translate-y-1/2 *:[svg]:size-4"
            dangerouslySetInnerHTML={{
              __html: currentBase.meta.logo,
            }}
          />
        )}
      </PickerTrigger>
      <PickerContent
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1"
      >
        <PickerRadioGroup
          value={currentBase?.name}
          onValueChange={handleValueChange}
        >
          <PickerGroup>
            {BASES.map((base) => (
              <PickerRadioItem
                key={base.name}
                value={base.name}
                className="rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {base.meta?.logo && (
                    <div
                      className="text-foreground *:[svg]:text-foreground! size-4 shrink-0 [&_svg]:size-4"
                      dangerouslySetInnerHTML={{
                        __html: base.meta.logo,
                      }}
                    />
                  )}
                  {base.title}
                </div>
              </PickerRadioItem>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
