import * as React from "react"
import { Suspense } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { SquareIcon } from "lucide-react"

import { icons, type IconName } from "@/registry/icons"

export const iconLibraries = {
  lucide: {
    name: "lucide",
    title: "Lucide",
    packages: ["lucide-react"],
    import: "import { [ICON_NAME] } from 'lucide-react'",
  },
  tabler: {
    name: "tabler",
    title: "Tabler Icons",
    packages: ["@tabler/icons-react"],
    import: "import { [ICON_NAME] } from '@tabler/icons-react'",
  },
  hugeicons: {
    name: "hugeicons",
    title: "HugeIcons",
    packages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
    import:
      "import { HugeiconsIcon } from '@hugeicons/react'\nimport { [ICON_NAME] } from '@hugeicons/core-free-icons';",
  },
} as const

export type IconLibrary = keyof typeof iconLibraries

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

type IconPromise =
  | ReturnType<typeof getLucideIcon>
  | ReturnType<typeof getTablerIcon>
  | ReturnType<typeof getHugeiconsIcon>
export function IconForIconLibrary({
  iconLibrary,
  icon,
  className,
}: {
  iconLibrary: IconLibrary
  icon: IconName
  className?: string
}) {
  const iconName = icons[icon]?.[iconLibrary]
  if (!iconName) {
    return null
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
    <Suspense fallback={<SquareIcon className="opacity-0" />}>
      <IconLoaderComponent
        iconLibrary={iconLibrary}
        iconPromise={iconPromise}
        className={className}
      />
    </Suspense>
  )
}

function IconLoaderComponent({
  iconLibrary,
  iconPromise,
  ...props
}: {
  iconLibrary: IconLibrary
  iconPromise: IconPromise
  [key: string]: any
}) {
  const IconComponent = React.use(
    iconPromise as React.Usable<Awaited<IconPromise>>
  )

  if (!IconComponent) {
    return null
  }

  if (iconLibrary === "hugeicons") {
    return (
      <HugeiconsIcon
        icon={IconComponent as IconSvgElement}
        strokeWidth={2}
        {...props}
      />
    )
  }

  return React.createElement(
    IconComponent as unknown as React.ComponentType<any>,
    props
  )
}
