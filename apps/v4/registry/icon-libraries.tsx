import * as React from "react"
import { Suspense } from "react"
import { SquareIcon } from "lucide-react"

import { icons, type IconName } from "@/registry/icons"

export const iconLibraries = {
  lucide: {
    name: "lucide",
    title: "Lucide",
    package: "lucide-react",
    import: "lucide-react",
  },
  radix: {
    name: "radix",
    title: "Radix Icons",
    package: "@radix-ui/react-icons",
    import: "@radix-ui/react-icons",
  },
  solar: {
    name: "solar",
    title: "Solar (Bold)",
    package: "@solar-icons/react-perf",
    import: "@solar-icons/react-perf/Bold",
  },
  tabler: {
    name: "tabler",
    title: "Tabler Icons",
    package: "@tabler/icons-react",
    import: "@tabler/icons-react",
  },
} as const

export type IconLibrary = keyof typeof iconLibraries

const getLucideIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("lucide-react")
  return iconModule[iconName as keyof typeof iconModule]
})

const getRadixIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("@radix-ui/react-icons")
  return iconModule[iconName as keyof typeof iconModule]
})

const getSolarIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("@solar-icons/react-perf/Bold")
  return iconModule[iconName as keyof typeof iconModule]
})

const getTablerIcon = React.cache(async (iconName: string) => {
  const iconModule = await import("@tabler/icons-react")
  return iconModule[iconName as keyof typeof iconModule]
})

type IconPromise =
  | ReturnType<typeof getLucideIcon>
  | ReturnType<typeof getRadixIcon>
  | ReturnType<typeof getSolarIcon>
  | ReturnType<typeof getTablerIcon>
export function IconForIconLibrary({
  iconLibrary,
  name,
  className,
}: {
  iconLibrary: IconLibrary
  name: IconName
  className?: string
}) {
  const iconName = icons[name]?.[iconLibrary]
  if (!iconName) {
    return null
  }

  const iconPromise =
    iconLibrary === "lucide"
      ? getLucideIcon(iconName)
      : iconLibrary === "radix"
        ? getRadixIcon(iconName)
        : iconLibrary === "solar"
          ? getSolarIcon(iconName)
          : iconLibrary === "tabler"
            ? getTablerIcon(iconName)
            : null

  if (!iconPromise) {
    return null
  }

  return (
    <Suspense fallback={<SquareIcon className="opacity-0" />}>
      <IconLoaderComponent iconPromise={iconPromise} className={className} />
    </Suspense>
  )
}

function IconLoaderComponent({
  iconPromise,
  className,
}: {
  iconPromise: IconPromise
  className?: string
}) {
  const IconComponent = React.use(
    iconPromise as React.Usable<React.ComponentType<any>>
  )

  if (!IconComponent) {
    return null
  }

  return React.createElement(IconComponent, { className })
}
