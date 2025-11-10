import * as React from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { IconLibraryName } from "shadcn/icons"

const getLucideIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("lucide-react")
  return iconModule[iconName as keyof typeof iconModule]
})

const getTablerIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("@tabler/icons-react")
  return iconModule[iconName as keyof typeof iconModule]
})

const getHugeiconsIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("@hugeicons/core-free-icons")
  return iconModule[iconName as keyof typeof iconModule]
})

// Server Component - resolves and renders icons.
export async function IconForIconLibrary({
  iconLibrary,
  iconName,
  className,
}: {
  iconLibrary: IconLibraryName
  iconName: string
  className?: string
}) {
  const IconComponent =
    iconLibrary === "lucide"
      ? await getLucideIcon(iconName)
      : iconLibrary === "tabler"
        ? await getTablerIcon(iconName)
        : iconLibrary === "hugeicons"
          ? await getHugeiconsIcon(iconName)
          : null

  if (!IconComponent) {
    return null
  }

  if (iconLibrary === "hugeicons") {
    return (
      <HugeiconsIcon
        icon={IconComponent as IconSvgElement}
        strokeWidth={2}
        className={className}
      />
    )
  }

  return React.createElement(
    IconComponent as unknown as React.ComponentType<any>,
    { className }
  )
}
