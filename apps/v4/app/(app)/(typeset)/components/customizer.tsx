"use client"

import * as React from "react"
import {
  ArrowHorizontalIcon,
  ParagraphSpacingIcon,
  TextSmallcapsIcon,
} from "@hugeicons/core-free-icons"
import { type IconSvgElement } from "@hugeicons/react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-nova/ui/card"
import { FieldGroup, FieldSeparator } from "@/styles/base-nova/ui/field"
import { FontPicker } from "@/app/(app)/(typeset)/components/font-picker"
import { TypesetGetCodeDrawer } from "@/app/(app)/(typeset)/components/get-code-drawer"
import { TypesetMainMenu } from "@/app/(app)/(typeset)/components/main-menu"
import { OptionPicker } from "@/app/(app)/(typeset)/components/option-picker"
import { TypesetRandomButton } from "@/app/(app)/(typeset)/components/random-button"
import {
  TYPESET_FLOWS,
  TYPESET_LEADINGS,
  TYPESET_MEASURES,
  TYPESET_SIZES,
  useTypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

const LineHeightIcon: IconSvgElement = [
  [
    "path",
    {
      d: "M4.5 3.5H19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      key: "0",
    },
  ],
  [
    "path",
    {
      d: "M4.5 20.5H19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      key: "1",
    },
  ],
  [
    "path",
    {
      d: "M17 17L14.8905 11.4741C13.9109 8.90801 13.4211 7.625 12.625 7.625C11.8289 7.625 11.3391 8.90801 10.3595 11.4741L8.25 17",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      key: "2",
    },
  ],
  [
    "path",
    {
      d: "M9.5 13H15.75",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      key: "3",
    },
  ],
]

export function TypesetCustomizer() {
  const [params, setParams] = useTypesetSearchParams()
  const isMobile = useIsMobile()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  // Resolve the rhythm to px off the current size: leading is a multiple,
  // flow is an em value.
  const sizePx = Number(params.scale)
  const leadingPx = Math.round(sizePx * Number(params.leading))
  const flowPx = Math.round(sizePx * parseFloat(params.flow))

  return (
    <Card
      className="dark isolate z-10 max-h-full min-h-0 w-full self-start rounded-2xl bg-card/90 backdrop-blur-xl md:w-(--customizer-width)"
      ref={anchorRef}
      size="sm"
    >
      <CardHeader className="hidden items-center justify-between gap-2 border-b md:flex">
        <TypesetMainMenu />
      </CardHeader>
      <CardContent className="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden max-md:px-0 md:overflow-y-auto">
        <FieldGroup className="flex-row gap-2.5 py-px **:data-[slot=field-separator]:-mx-4 **:data-[slot=field-separator]:w-auto max-md:px-3 md:flex-col md:gap-3.25">
          {/* Below ~60ch the viewport already constrains width, so measure
              does nothing: hide it. */}
          <OptionPicker
            label="Measure"
            className="max-[28rem]:hidden"
            isMobile={isMobile}
            anchorRef={anchorRef}
            param="measure"
            icon={ArrowHorizontalIcon}
            options={TYPESET_MEASURES}
            value={params.measure}
            onChange={(measure) => setParams({ measure })}
          />
          <FieldSeparator className="hidden md:block" />
          <FontPicker
            label="Heading"
            param="heading"
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <FontPicker
            label="Body"
            param="body"
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <FontPicker
            label="Mono"
            param="mono"
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <FieldSeparator className="hidden md:block" />
          <OptionPicker
            label="Size"
            isMobile={isMobile}
            anchorRef={anchorRef}
            param="scale"
            icon={TextSmallcapsIcon}
            options={TYPESET_SIZES}
            value={params.scale}
            onChange={(scale) => setParams({ scale })}
          />
          <OptionPicker
            label="Leading"
            isMobile={isMobile}
            anchorRef={anchorRef}
            param="leading"
            icon={LineHeightIcon}
            options={TYPESET_LEADINGS}
            value={params.leading}
            onChange={(leading) => setParams({ leading })}
          />
          <OptionPicker
            label="Flow"
            isMobile={isMobile}
            anchorRef={anchorRef}
            param="flow"
            icon={ParagraphSpacingIcon}
            options={TYPESET_FLOWS}
            value={params.flow}
            onChange={(flow) => setParams({ flow })}
          />
          {process.env.NODE_ENV === "development" && (
            <div className="hidden px-1 pt-0.5 text-center font-mono text-xs text-muted-foreground tabular-nums md:block">
              {sizePx}px / {leadingPx}px / {flowPx}px
            </div>
          )}
          {/* Scroll-end spacer: the group is a CQ container (inline-size
              containment), so trailing padding cannot grow it. */}
          <div aria-hidden className="w-0.5 shrink-0 md:hidden" />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex min-w-0 flex-row-reverse gap-2 border-t md:flex-col md:**:[button]:w-full">
        <TypesetRandomButton className="min-w-0 flex-1 md:flex-none" />
        <TypesetGetCodeDrawer className="min-w-0 flex-1 touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! md:flex-none xl:hidden pointer-coarse:h-10!" />
      </CardFooter>
    </Card>
  )
}
