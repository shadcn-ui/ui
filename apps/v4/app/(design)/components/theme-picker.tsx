"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useQueryStates } from "nuqs"

import { useMounted } from "@/hooks/use-mounted"
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
  const mounted = useMounted()
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentTheme = React.useMemo(
    () => themes.find((theme) => theme.name === params.theme),
    [themes, params.theme]
  )

  const currentThemeIsBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.theme),
    [params.theme]
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
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Theme</div>
            <div className="text-foreground text-sm font-medium">
              {currentTheme?.title}
            </div>
            {mounted && resolvedTheme && (
              <div
                style={
                  {
                    "--color":
                      currentTheme?.cssVars?.[
                        resolvedTheme as "light" | "dark"
                      ]?.[
                        currentThemeIsBaseColor ? "muted-foreground" : "primary"
                      ],
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
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {themes.map((theme) => {
          const isBaseColor = BASE_COLORS.find(
            (baseColor) => baseColor.name === theme.name
          )
          return (
            <SelectItem
              key={theme.name}
              value={theme.name}
              className="rounded-lg"
            >
              <div className="flex items-center gap-2">
                {mounted && resolvedTheme && (
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
                )}
                {theme.title}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
