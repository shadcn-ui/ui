"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useQueryStates } from "nuqs"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type BaseColor } from "@/registry/base-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function BaseColorPicker({}) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
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
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs font-medium">
              Base Color
            </div>
            {currentBaseColor?.title}
            {mounted && resolvedTheme && (
              <div
                style={
                  {
                    "--color":
                      currentBaseColor?.cssVars?.[
                        resolvedTheme as "light" | "dark"
                      ]?.["muted-foreground"],
                  } as React.CSSProperties
                }
                className="absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full bg-(--color)"
              />
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="right"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {BASE_COLORS.map((baseColor) => (
          <SelectItem
            key={baseColor.name}
            value={baseColor.name}
            className="rounded-lg"
          >
            <div className="flex items-center gap-2">
              {mounted && resolvedTheme && (
                <div
                  style={
                    {
                      "--color":
                        baseColor.cssVars?.[
                          resolvedTheme as "light" | "dark"
                        ]?.["muted-foreground"],
                    } as React.CSSProperties
                  }
                  className="size-4 rounded-full bg-(--color)"
                />
              )}
              {baseColor.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
