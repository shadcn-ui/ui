"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useQueryStates } from "nuqs"

import { BASE_COLORS } from "@/registry/base-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Theme } from "@/registry/themes"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function ThemePicker({ themes }: { themes: readonly Theme[] }) {
  const { resolvedTheme } = useTheme()
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentTheme = React.useMemo(
    () => themes.find((theme) => theme.name === params.theme),
    [themes, params.theme]
  )

  React.useEffect(() => {
    if (!currentTheme && themes.length > 0) {
      setParams({ theme: themes[0].name })
    }
  }, [currentTheme, themes, setParams])

  return (
    <Select
      value={currentTheme?.name}
      onValueChange={(value) => {
        setParams({ theme: value as Theme["name"] })
      }}
    >
      <SelectTrigger className="data-[state=open]:bg-muted/30 dark:data-[state=open]:bg-muted w-full text-left data-[size=default]:h-14">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs font-medium">
              Theme
            </div>
            {currentTheme?.title}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="right"
        align="start"
        className="data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {themes.map((theme) => {
          const isBaseColor = BASE_COLORS.find(
            (baseColor) => baseColor.name === theme.name
          )
          return (
            <SelectItem key={theme.name} value={theme.name}>
              <div className="flex items-center gap-2">
                <div
                  style={
                    {
                      "--color":
                        theme.cssVars?.[resolvedTheme as "light" | "dark"]?.[
                          isBaseColor ? "muted-foreground" : "primary"
                        ],
                    } as React.CSSProperties
                  }
                  className="size-4 rounded-full bg-(--color)"
                />
                {theme.title}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
