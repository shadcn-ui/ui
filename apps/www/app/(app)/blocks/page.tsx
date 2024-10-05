import { getAllBlockIds } from "@/lib/blocks"
import { THEMES } from "@/lib/themes"
import { BlockDisplay } from "@/components/block-display"
import { ThemesSwitcher } from "@/components/themes-selector"

export default async function BlocksPage() {
  const blocks = (await getAllBlockIds()).filter(
    (name) =>
      !name.startsWith("chart-") &&
      !name.startsWith("sidebar-01") &&
      !name.startsWith("login-01")
  )

  // These themes are not compatible with the blocks yet.
  const themes = THEMES.filter(
    (theme) => !["default-daylight", "default-midnight"].includes(theme.id)
  )

  return (
    <div className="gap-3 md:flex md:flex-row-reverse md:items-start">
      <ThemesSwitcher
        themes={themes}
        className="fixed inset-x-0 bottom-0 z-40 mt-12 flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:bottom-auto lg:top-20"
      />
      <div className="grid flex-1 gap-24 lg:gap-48">
        {blocks.map((name, index) => (
          <BlockDisplay key={`${name}-${index}`} name={name} />
        ))}
      </div>
    </div>
  )
}
