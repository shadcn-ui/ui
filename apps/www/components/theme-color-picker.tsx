"use client"

import debounce from "lodash.debounce"
import { useTheme } from "next-themes"
import { HslColor, HslStringColorPicker } from "react-colorful"

import { cn } from "@/lib/utils"
import { ConfigThemeCssVarsKey, useConfig } from "@/hooks/use-config"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"

export const hslStringToHsl = (hslString: string): HslColor => {
  const [h, s, l] = hslString
    .replace("hsl(", "")
    .replace("%", "")
    .replace("%)", "")
    .split(" ")
    .map((v) => parseInt(v))
  return { h, s, l }
}
export const hslToHslString = (hsl: HslColor): string => {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

export const removeHslParentheses = (hslString: string): string => {
  return hslString.replace("hsl(", "").replace(")", "")
}

export const addHslParentheses = (hslString: string): string => {
  if (hslString.startsWith("hsl(")) {
    return hslString
  }
  return `hsl(${hslString})`
}

export const blackHsl: HslColor = {
  h: 0,
  s: 0,
  l: 0,
}
export const blackHslString = hslToHslString(blackHsl)
export const whiteHsl: HslColor = {
  h: 0,
  s: 0,
  l: 100,
}
export const whiteHslString = hslToHslString(whiteHsl)

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}
export const ThemeColorPicker = ({
  variableName,
  hasForeground,
}: {
  variableName: ConfigThemeCssVarsKey
  hasForeground?: boolean
}) => {
  const [config, setConfig] = useConfig()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"

  const handleColorChange = (
    color: string,
    varName: ConfigThemeCssVarsKey
  ): void => {
    setConfig((oldConfig) => {
      console.log("changing colors")
      const newConfig = { ...oldConfig }
      const newTheme = isLight ? { ...newConfig.light } : { ...newConfig.dark }
      newTheme[varName] = removeHslParentheses(color)
      if (isLight) {
        newConfig.light = newTheme
      } else {
        newConfig.dark = newTheme
      }

      // TODO: If the dark mode version of this color is the default
      // for the theme, calculate a new complementary color for the dark mode

      return newConfig
    })
  }
  const debouncedHandleColorChange = debounce(handleColorChange, 150, {
    leading: false,
    trailing: true,
  })

  const hslColor = isLight
    ? config.light[variableName]
    : config.dark[variableName]

  const foregroundVariableName =
    `${variableName}-foreground` as ConfigThemeCssVarsKey

  const hslColorForeground = hasForeground
    ? isLight
      ? config.light[foregroundVariableName]
      : config.dark[foregroundVariableName]
    : hslStringToHsl(hslColor).l > 50
    ? blackHslString
    : whiteHslString

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"outline"}
          size="sm"
          className={cn("justify-start", "w-full")}
          style={
            {
              "--theme-primary": `hsl(${hslColor})`,
            } as React.CSSProperties
          }
        >
          <span
            className={cn(
              "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
            )}
          ></span>
          {variableName}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Color Picker for {variableName}</DialogTitle>
          <DialogDescription>
            Select the color for {variableName}.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div
            className="flex h-[50px] items-center justify-center rounded"
            style={{
              background: `hsl(${hslColor})`,
              color: `hsl(${hslColorForeground})`,
            }}
          >
            {variableName}
          </div>
          <div className="flex flex-row">
            <div className="m-2">
              <h3>
                {hasForeground ? "Background Color Picker" : "Color Picker"}
              </h3>
              <HslStringColorPicker
                color={`hsl(${hslColor})`}
                onChange={(color) =>
                  debouncedHandleColorChange(color, variableName)
                }
              />
            </div>
            {hasForeground && (
              <div className="m-2">
                <h3>Foreground Color Picker</h3>
                <HslStringColorPicker
                  color={`hsl(${hslColorForeground})`}
                  onChange={(color) =>
                    debouncedHandleColorChange(
                      color,
                      `${variableName}-foreground` as ConfigThemeCssVarsKey
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
