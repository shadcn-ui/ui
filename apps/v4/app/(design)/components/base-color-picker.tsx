"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useQueryStates } from "nuqs"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type BaseColorName } from "@/registry/config"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function BaseColorPicker({}) {
  const { resolvedTheme, setTheme } = useTheme()
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
        if (value === "dark") {
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
          return
        }

        setParams({ baseColor: value as BaseColorName })
      }}
    >
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Base Color</div>
            <div className="text-foreground text-sm font-medium">
              {currentBaseColor?.title}
            </div>
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
        side="left"
        align="start"
        className="ring-foreground/10 w-48 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        <SelectGroup>
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
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectItem value="dark" className="rounded-lg">
            <div className="flex flex-col justify-start">
              <div>
                Switch to {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
              </div>
              <div className="text-muted-foreground text-xs">
                Base colors are easier to see in dark mode.
              </div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
