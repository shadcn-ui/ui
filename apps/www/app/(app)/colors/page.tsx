import { getColors } from "@/lib/colors"
import { ColorPalette } from "@/components/color-palette"

const colors = getColors()

export default function ColorsPage() {
  return (
    <div id="colors" className="grid scroll-mt-20 gap-8">
      {colors.map((colorPalette) => (
        <ColorPalette key={colorPalette.name} colorPalette={colorPalette} />
      ))}
    </div>
  )
}
