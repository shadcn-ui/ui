import * as React from "react"
import { Suspense } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { SquareIcon } from "lucide-react"
import { IconLibraryName } from "shadcn/icons"

import { cn } from "@/lib/utils"

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

const resolvedIconCache = new Map<string, any>()

type IconPromise =
  | ReturnType<typeof getLucideIcon>
  | ReturnType<typeof getTablerIcon>
  | ReturnType<typeof getHugeiconsIcon>

export function IconForIconLibrary({
  iconLibrary,
  iconName,
  className,
}: {
  iconLibrary: IconLibraryName
  iconName: string
  className?: string
}) {
  const cacheKey = `${iconLibrary}:${iconName}`
  const cachedComponent = resolvedIconCache.get(cacheKey)

  if (cachedComponent) {
    if (iconLibrary === "hugeicons") {
      return (
        <HugeiconsIcon
          icon={cachedComponent as unknown as IconSvgElement}
          strokeWidth={2}
          className={className}
        />
      )
    }
    return React.createElement(cachedComponent, { className })
  }

  const iconPromise =
    iconLibrary === "lucide"
      ? getLucideIcon(iconName)
      : iconLibrary === "tabler"
        ? getTablerIcon(iconName)
        : iconLibrary === "hugeicons"
          ? getHugeiconsIcon(iconName)
          : null

  if (!iconPromise) {
    return null
  }

  return (
    <Suspense fallback={<SquareIcon className={cn("opacity-0", className)} />}>
      <IconLoaderComponent
        iconLibrary={iconLibrary}
        iconPromise={iconPromise}
        cacheKey={cacheKey}
        className={className}
      />
    </Suspense>
  )
}

function IconLoaderComponent({
  iconLibrary,
  iconPromise,
  cacheKey,
  className,
}: {
  iconLibrary: IconLibraryName
  iconPromise: IconPromise
  cacheKey: string
  className?: string
}) {
  const IconComponent = React.use(
    iconPromise as React.Usable<Awaited<IconPromise>>
  )

  if (!IconComponent) {
    return null
  }

  // Cache the resolved component for future renders.
  resolvedIconCache.set(cacheKey, IconComponent)

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
