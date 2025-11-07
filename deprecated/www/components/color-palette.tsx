import * as React from "react"

import { type ColorPalette } from "@/lib/colors"
import { Color } from "@/components/color"
import {
  ColorFormatSelector,
  ColorFormatSelectorSkeleton,
} from "@/components/color-format-selector"

export function ColorPalette({ colorPalette }: { colorPalette: ColorPalette }) {
  return (
    <div
      id={colorPalette.name}
      className="rounded-lg shadow-sm ring-1 ring-border"
    >
      <div className="flex items-center p-2 pb-0">
        <div className="flex-1 pl-1 text-sm font-medium">
          <h2 className="capitalize">{colorPalette.name}</h2>
        </div>
        <React.Suspense fallback={<ColorFormatSelectorSkeleton />}>
          <ColorFormatSelector
            color={colorPalette.colors[0]}
            className="ml-auto"
          />
        </React.Suspense>
      </div>
      <div className="flex flex-col gap-1 p-2 sm:flex-row sm:gap-2">
        {colorPalette.colors.map((color) => (
          <Color key={color.hex} color={color} />
        ))}
      </div>
    </div>
  )
}
