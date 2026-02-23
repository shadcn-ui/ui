import { getColors } from "@/lib/colors"
import { ColorPalette } from "@/components/color-palette"

export const dynamic = "force-static"
export const revalidate = false

export default function ColorsPage() {
  const colors = getColors()

  return (
    <div className="grid gap-8 lg:gap-16 xl:gap-20">
      {colors.map((colorPalette) => (
        <ColorPalette key={colorPalette.name} colorPalette={colorPalette} />
      ))}
    </div>
  )
}
