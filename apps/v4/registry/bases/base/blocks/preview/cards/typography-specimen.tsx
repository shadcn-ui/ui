"use client"

import * as React from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/bases/base/ui/card"
import { FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function TypographySpecimen() {
  const [params] = useDesignSystemSearchParams()

  const currentFont = React.useMemo(
    () => FONTS.find((font) => font.value === params.font),
    [params.font]
  )

  const currentFontHeading = React.useMemo(
    () => FONTS.find((font) => font.value === params.fontHeading),
    [params.fontHeading]
  )
  const headingLabel =
    currentFontHeading?.name && currentFontHeading.name !== currentFont?.name
      ? currentFontHeading.name
      : "Inherit"
  const bodyLabel = currentFont?.name ?? "Default"

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {headingLabel} - {bodyLabel}
        </div>
        <p className="cn-font-heading text-2xl font-medium">
          Designing with rhythm and hierarchy.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A strong body style keeps long-form content readable and balances the
          visual weight of headings.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Thoughtful spacing and cadence help paragraphs scan quickly without
          feeling dense.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Sample Button
        </Button>
      </CardFooter>
    </Card>
  )
}
