"use client"

import type { IconLibraryName } from "shadcn/icons"

import { IconForIconLibrary } from "@/app/(design)/design/components/icon-loader"
import { useDesignSystemParam } from "@/app/(design)/design/hooks/use-design-system"

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
    <IconForIconLibrary
      iconLibrary={iconLibrary}
      iconName={iconName}
      className={className}
    />
  )
}
