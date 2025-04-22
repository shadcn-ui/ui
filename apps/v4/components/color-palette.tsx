import { type ColorPalette } from "@/lib/colors"
import { Color } from "@/components/color"
import { ColorFormatSelector } from "@/components/color-format-selector"

export function ColorPalette({ colorPalette }: { colorPalette: ColorPalette }) {
  return (
    <div
      id={colorPalette.name}
      className="ring-border scroll-mt-20 rounded-lg shadow-sm ring-1"
    >
      <div className="flex items-center border-b p-2">
        <div className="flex-1 pl-1 text-sm font-medium">
          <h2 className="capitalize">{colorPalette.name}</h2>
        </div>
        <ColorFormatSelector
          color={colorPalette.colors[0]}
          className="ml-auto"
        />
      </div>
      <div className="flex flex-col gap-1 p-2 sm:flex-row sm:gap-2">
        {colorPalette.colors.map((color) => (
          <Color key={color.hex} color={color} />
        ))}
      </div>
    </div>
  )
}
