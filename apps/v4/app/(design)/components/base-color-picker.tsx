"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useQueryStates } from "nuqs"

import { BASE_COLORS, type BaseColor } from "@/registry/base-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function BaseColorPicker() {
  const { resolvedTheme } = useTheme()
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.baseColor),
    [params.baseColor]
  )

  return (
    <Select
      value={currentBaseColor?.name}
      onValueChange={(value) => {
        setParams({ baseColor: value as BaseColor["name"] })
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a base color" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {BASE_COLORS.map((baseColor) => (
          <SelectItem key={baseColor.name} value={baseColor.name}>
            <div className="flex items-center gap-2">
              <div
                style={
                  {
                    "--color":
                      baseColor.cssVars?.[resolvedTheme as "light" | "dark"]?.[
                        "muted-foreground"
                      ],
                  } as React.CSSProperties
                }
                className="size-4 rounded-[4px] bg-(--color)"
              />
              {baseColor.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
