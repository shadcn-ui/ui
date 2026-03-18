"use client"

import * as React from "react"

import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { STYLES } from "@/registry/styles"
import { FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function StyleOverview() {
  const [params] = useDesignSystemSearchParams()

  const currentFont = React.useMemo(
    () => FONTS.find((font) => font.value === params.font),
    [params.font]
  )

  const currentFontHeading = React.useMemo(
    () => FONTS.find((font) => font.value === params.fontHeading),
    [params.fontHeading]
  )

  const currentStyle = React.useMemo(
    () => STYLES.find((style) => style.name === params.style),
    [params.style]
  )

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 style-lyra:gap-4 style-mira:gap-4">
        <div className="flex flex-col gap-1">
          <div className="cn-font-heading text-2xl font-medium style-lyra:text-lg style-mira:text-lg">
            {currentStyle?.title} -{" "}
            {currentFontHeading?.name &&
            currentFontHeading.name !== currentFont?.name
              ? currentFontHeading.name
              : currentFont?.name}
          </div>
          <div className="line-clamp-2 text-base text-muted-foreground style-lyra:text-sm style-mira:text-sm">
            Designers love packing quirky glyphs into test phrases. This is a
            preview of the typography styles.
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {[
            "--background",
            "--foreground",
            "--primary",
            "--secondary",
            "--muted",
            "--accent",
            "--border",
            "--chart-1",
            "--chart-2",
            "--chart-3",
            "--chart-4",
            "--chart-5",
          ].map((variant) => (
            <div
              key={variant}
              className="flex flex-col flex-wrap items-center gap-2"
            >
              <div
                className="relative aspect-square w-full rounded-lg bg-(--color) after:absolute after:inset-0 after:rounded-lg after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten"
                style={
                  {
                    "--color": `var(${variant})`,
                  } as React.CSSProperties
                }
              />
              <div className="hidden max-w-14 truncate font-mono text-[0.60rem] md:block style-lyra:max-w-10 style-mira:max-w-10">
                {variant}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
