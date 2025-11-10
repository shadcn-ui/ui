"use client"

import { lazy, Suspense } from "react"
import { SquareIcon } from "lucide-react"
import type { IconLibraryName } from "shadcn/icons"

import { useDesignSystemParam } from "@/app/(design)/design/hooks/use-design-system"

const IconLucide = lazy(() =>
  import("@/registry/icons/icon-lucide").then((mod) => ({
    default: mod.IconLucide,
  }))
)

const IconTabler = lazy(() =>
  import("@/registry/icons/icon-tabler").then((mod) => ({
    default: mod.IconTabler,
  }))
)

const IconHugeicons = lazy(() =>
  import("@/registry/icons/icon-hugeicons").then((mod) => ({
    default: mod.IconHugeicons,
  }))
)

export function IconPlaceholder({
  className,
  ...props
}: {
  [K in IconLibraryName]: string
} & {
  className?: string
}) {
  const iconLibrary = useDesignSystemParam("iconLibrary")
  const iconName = props[iconLibrary]

  if (!iconName) {
    return null
  }

  return (
    <Suspense fallback={<SquareIcon className={className} />}>
      {iconLibrary === "lucide" && (
        <IconLucide name={iconName} className={className} />
      )}
      {iconLibrary === "tabler" && (
        <IconTabler name={iconName} className={className} />
      )}
      {iconLibrary === "hugeicons" && (
        <IconHugeicons name={iconName} className={className} />
      )}
    </Suspense>
  )
}
