"use client"

import React from "react"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { is } from "date-fns/locale"
import debounce from "lodash.debounce"
import { CheckIcon, XIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { HslColor, HslStringColorPicker, RgbColor } from "react-colorful"

import { cn } from "@/lib/utils"
import {
  Config,
  ConfigThemeCssVars,
  ConfigThemeCssVarsKey,
  useConfig,
} from "@/hooks/use-config"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

const hslStringToHsl = (hslString: string): HslColor => {
  const [h, s, l] = hslString
    .replace("hsl(", "")
    .replace("%", "")
    .replace("%)", "")
    .split(" ")
    .map((v) => parseInt(v))
  return { h, s, l }
}
const hslToHslString = (hsl: HslColor): string => {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

const removeHslParentheses = (hslString: string): string => {
  return hslString.replace("hsl(", "").replace(")", "")
}

const addHslParentheses = (hslString: string): string => {
  if (hslString.startsWith("hsl(")) {
    return hslString
  }
  return `hsl(${hslString})`
}

const blackHsl: HslColor = {
  h: 0,
  s: 0,
  l: 0,
}
const blackHslString = hslToHslString(blackHsl)
const whiteHsl: HslColor = {
  h: 0,
  s: 0,
  l: 100,
}
const whiteHslString = hslToHslString(whiteHsl)

/**
 *
 * @param {RgbColor} color The RGB color
 * @returns {string} The hex color
 *
 * @see https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
const rgbToHex = (color: RgbColor) => {
  const { r, g, b } = color
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
  )
}

/**
 *
 * Relative luminance as defined by WCAG 2.0 is not the HSL luminance.
 *
 * @param   {RgbColor}  color The RGB color
 * @return  {number}          The luminance
 *
 * @see https://alvaromontoro.com/blog/67854/building-your-own-color-contrast-checker
 *
 */

const luminance = (color: RgbColor) => {
  const { r, g, b } = color
  const a = [r, g, b].map(function (v) {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 *
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {HslColor}  color The HSL color
 * @return  {Array}           The RGB representation
 *
 * @see https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */
const hslToRgb = (color: HslColor) => {
  let r, g, b
  let { h, s, l } = color
  h = h / 360
  s = s / 100
  l = l / 100

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb(p, q, h + 1 / 3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1 / 3)
  }

  const rgb: RgbColor = {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }

  return rgb
}

const hueToRgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
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

  const calculateContrastRatio = (
    theme: ConfigThemeCssVars,
    varName: ConfigThemeCssVarsKey
  ) => {
    if (!hasForeground) return 0
    const foregroundVariableName = varName.endsWith("-foreground")
      ? varName
      : (`${varName}-foreground` as ConfigThemeCssVarsKey)
    const backgroundVariableName = varName.endsWith("-foreground")
      ? (varName.replace("-foreground", "") as ConfigThemeCssVarsKey)
      : varName

    // src: https://alvaromontoro.com/blog/67854/building-your-own-color-contrast-checker
    const backgroundHsl = hslStringToHsl(theme[backgroundVariableName])
    const foregroundHsl = hasForeground
      ? hslStringToHsl(theme[foregroundVariableName])
      : { h: 0, s: 0, l: 0 }

    const backgroundRgb = hslToRgb(backgroundHsl)
    const foregroundRgb = hslToRgb(foregroundHsl)

    const backgroundLuminance = luminance(backgroundRgb)
    const foregroundLuminance = luminance(foregroundRgb)

    console.log(
      "🚀 ~ file: theme-color-picker.tsx:185 ~ foregroundHsl:",
      foregroundHsl
    )
    console.log(
      "🚀 ~ file: theme-color-picker.tsx:185 ~ foregroundRgb:",
      foregroundRgb
    )
    console.log(
      "🚀 ~ file: theme-color-picker.tsx:189 ~ foregroundLuminance:",
      foregroundLuminance
    )
    console.log(
      "🚀 ~ file: theme-color-picker.tsx:185 ~ backgroundHsl:",
      backgroundHsl
    )
    console.log(
      "🚀 ~ file: theme-color-picker.tsx:185 ~ backgroundRgb:",
      backgroundRgb
    )
    console.log(
      "🚀 ~ file: theme-color-picker.tsx:189 ~ backgroundLuminance:",
      backgroundLuminance
    )

    const ratio =
      backgroundLuminance > foregroundLuminance
        ? (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05)
        : (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05)
    return ratio
  }

  // const [contrastRatio, setContrastRatio] = React.useState(
  //   calculateContrastRatio(isLight ? config.light : config.dark, variableName)
  // )

  const handleColorChange = (
    color: string,
    varName: ConfigThemeCssVarsKey
  ): void => {
    setConfig((oldConfig) => {
      const newConfig = { ...oldConfig }
      const newTheme = isLight ? { ...newConfig.light } : { ...newConfig.dark }
      newTheme[varName] = removeHslParentheses(color)

      // setContrastRatio(calculateContrastRatio(newTheme, varName))

      if (isLight) {
        newConfig.light = newTheme
      } else {
        newConfig.dark = newTheme
      }

      return newConfig
    })
  }
  const debouncedHandleColorChange = debounce(handleColorChange, 150, {
    leading: false,
    trailing: true,
  })

  const foregroundVariableName =
    `${variableName}-foreground` as ConfigThemeCssVarsKey

  const backgroundHslColorString = isLight
    ? config.light[variableName]
    : config.dark[variableName]

  const foregroundHslColorString = hasForeground
    ? isLight
      ? config.light[foregroundVariableName]
      : config.dark[foregroundVariableName]
    : blackHslString

  const backgroundHslColor = hslStringToHsl(backgroundHslColorString)
  const foregroundHslColor = hslStringToHsl(foregroundHslColorString)

  const backgroundRgbColor = hslToRgb(backgroundHslColor)
  const foregroundRgbColor = hasForeground
    ? hslToRgb(foregroundHslColor)
    : { r: 0, g: 0, b: 0 }

  const safeBackgroundTextColor =
    hslStringToHsl(backgroundHslColorString).l > 50 ? "black" : "white"

  const safeForegroundTextColor =
    hslStringToHsl(foregroundHslColorString).l > 50 ? "black" : "white"

  // const contrastRatio = calculateContrastRatio(
  //   isLight ? config.light : config.dark,
  //   variableName
  // )

  // src: https://alvaromontoro.com/blog/67854/building-your-own-color-contrast-checker

  const backgroundHexColor = rgbToHex(backgroundRgbColor)
  const foregroundHexColor = rgbToHex(foregroundRgbColor)

  const backgroundLuminance = luminance(backgroundRgbColor)
  const foregroundLuminance = luminance(foregroundRgbColor)

  const contrastRatio =
    backgroundLuminance > foregroundLuminance
      ? (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05)
      : (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05)

  const aaLargePass = contrastRatio < 1 / 3
  const aaSmallPass = contrastRatio < 1 / 4.5
  const aaaLargePass = contrastRatio < 1 / 4.5
  const aaaSmallPass = contrastRatio < 1 / 7

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"outline"}
          size="sm"
          className={cn("justify-start", "w-full")}
          style={
            {
              "--theme-primary": `hsl(${backgroundHslColorString})`,
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
        {hasForeground && (
          <Accordion
            type="single"
            collapsible
            className="w-full rounded border px-2"
            value={config.wcagOpen ? "item-1" : ""}
            onValueChange={() => {
              setConfig((oldConfig) => {
                return {
                  ...oldConfig,
                  wcagOpen: !oldConfig.wcagOpen,
                }
              })
            }}
          >
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger
                className={cn(
                  aaLargePass && aaSmallPass && aaaLargePass && aaaSmallPass
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                <span>
                  Text Contrast Test
                  {aaLargePass && aaSmallPass && aaaLargePass && aaaSmallPass
                    ? " (pass)"
                    : " (fail)"}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Based on the WCAG 2.0 guidelines:
                  <Popover>
                    <PopoverTrigger>
                      <InfoCircledIcon className="ml-1 h-3 w-3" />
                      <span className="sr-only">About styles</span>
                    </PopoverTrigger>
                    <PopoverContent
                      className="space-y-3 rounded-[0.5rem] text-sm"
                      side="bottom"
                      align="start"
                    >
                      <p>
                        The{" "}
                        <a
                          href="https://www.w3.org/WAI/WCAG2AA-Conformance"
                          className="text-blue-700 underline"
                        >
                          Web Content Accessibility Guidelines (WCAG) 2.0
                        </a>{" "}
                        tests ensure your content is accessible to all users. It
                        requires a minimum contrast ratio of 4.5:1 for regular
                        text and 3:1 for large text to ensure readability for
                        users with visual impairments, with stricter ratios for
                        higher levels of accessibility.
                      </p>
                      <p>
                        Level AA vs AAA defines the{" "}
                        <a
                          href="https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels"
                          className="text-blue-500 underline"
                        >
                          level of compliance.
                        </a>
                      </p>
                      <ul className="list list-outside list-disc rounded border bg-slate-100 p-2 pl-6">
                        <li>
                          For Level AA conformance, the Web page satisfies all
                          the Level A and Level AA Success Criteria, or a Level
                          AA conforming alternate version is provided.
                        </li>
                        <li>
                          For Level AAA conformance, the Web page satisfies all
                          the Level A, Level AA and Level AAA Success Criteria,
                          or a Level AAA conforming alternate version is
                          provided.
                        </li>
                      </ul>
                      <p>
                        Large text is defined as at least 18pt or 14pt bold as{" "}
                        <a
                          href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html"
                          className="text-blue-500 underline"
                        >
                          stated by the WCAG
                        </a>
                        .
                      </p>
                    </PopoverContent>
                  </Popover>
                </p>

                <ul>
                  <li className="flex flex-row items-center">
                    {aaLargePass ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <XIcon size={20} className="text-red-500" />
                    )}{" "}
                    AA-level large text
                  </li>
                  <li className="flex flex-row items-center">
                    {aaSmallPass ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <XIcon size={20} className="text-red-500" />
                    )}{" "}
                    AA-level small text
                  </li>
                  <li className="flex flex-row items-center">
                    {aaaLargePass ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <XIcon size={20} className="text-red-500" />
                    )}{" "}
                    AAA-level large text
                  </li>
                  <li className="flex flex-row items-center">
                    {aaaSmallPass ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <XIcon size={20} className="text-red-500" />
                    )}{" "}
                    AAA-level small text
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div>
          <div
            className="flex h-[50px] items-center justify-center rounded"
            style={{
              background: `hsl(${backgroundHslColorString})`,
              color: `hsl(${foregroundHslColorString})`,
            }}
          >
            {variableName}
          </div>
          <div className="flex flex-row">
            <div className="m-2">
              <h3>
                {hasForeground ? "Background Color Picker" : "Color Picker"}
              </h3>
              {/* <div
                className={cn("p-2")}
                style={{
                  color: `${safeBackgroundTextColor}`,
                  backgroundColor: `hsl(${backgroundHslColorString})`,
                }}
              >
                hsl({backgroundHslColorString})<br />
                h: {backgroundHslColor.h}, s: {backgroundHslColor.s}, l:{" "}
                {backgroundHslColor.l}
              </div>
              <div
                className={cn("p-2")}
                style={{
                  color: `${safeBackgroundTextColor}`,
                  backgroundColor: `rgb(${backgroundRgbColor.r}, ${backgroundRgbColor.g}, ${backgroundRgbColor.b})`,
                }}
              >
                rgb({backgroundRgbColor.r}, {backgroundRgbColor.g},{" "}
                {backgroundRgbColor.b})
              </div>
              <div
                className={cn("p-2")}
                style={{
                  color: `${safeBackgroundTextColor}`,
                  backgroundColor: backgroundHexColor,
                }}
              >
                {backgroundHexColor}
              </div> */}
              <HslStringColorPicker
                color={`hsl(${backgroundHslColorString})`}
                onChange={(color) =>
                  debouncedHandleColorChange(color, variableName)
                }
              />
            </div>
            {hasForeground && (
              <div className="m-2">
                <h3>Foreground Color Picker</h3>
                {/* <div
                  className={cn("p-2")}
                  style={{
                    color: `${safeForegroundTextColor}`,
                    backgroundColor: `hsl(${foregroundHslColorString})`,
                  }}
                >
                  hsl({foregroundHslColorString})
                </div>
                <div
                  className={cn("p-2")}
                  style={{
                    color: `${safeForegroundTextColor}`,
                    backgroundColor: `rgb(${foregroundRgbColor.r}, ${foregroundRgbColor.g}, ${foregroundRgbColor.b})`,
                  }}
                >
                  rgb({foregroundRgbColor.r}, {foregroundRgbColor.g},{" "}
                  {foregroundRgbColor.b})
                </div>
                <div
                  className={cn("p-2")}
                  style={{
                    color: `${safeForegroundTextColor}`,
                    backgroundColor: foregroundHexColor,
                  }}
                >
                  {foregroundHexColor}
                </div> */}
                <HslStringColorPicker
                  color={`hsl(${foregroundHslColorString})`}
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
