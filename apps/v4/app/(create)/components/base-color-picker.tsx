"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type BaseColorName } from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerItem,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function BaseColorPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()

  const currentBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.baseColor),
    [params.baseColor]
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Base Color</div>
            <div className="text-foreground text-sm font-medium">
              {currentBaseColor?.title}
            </div>
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
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full bg-(--color) select-none"
            />
          )}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentBaseColor?.name}
            onValueChange={(value) => {
              if (value === "dark") {
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
                return
              }

              setParams({ baseColor: value as BaseColorName })
            }}
          >
            <PickerGroup>
              {BASE_COLORS.map((baseColor) => (
                <PickerRadioItem key={baseColor.name} value={baseColor.name}>
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
                </PickerRadioItem>
              ))}
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              <PickerItem
                onClick={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }}
              >
                <div className="flex flex-col justify-start pointer-coarse:gap-1">
                  <div>
                    Switch to {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
                  </div>
                  <div className="text-muted-foreground text-xs pointer-coarse:text-sm">
                    Base colors are easier to see in dark mode.
                  </div>
                </div>
              </PickerItem>
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="baseColor"
        className="absolute top-1/2 right-10 -translate-y-1/2"
      />
    </div>
  )
}
