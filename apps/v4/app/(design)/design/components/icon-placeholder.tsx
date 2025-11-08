"use client"

import * as React from "react"
import type { IconLibraryName, IconName } from "shadcn/icons"

import { IconForIconLibrary } from "@/app/(design)/design/components/icon-loader"
import { useDesignSystemParam } from "@/app/(design)/design/hooks/use-design-system"

export function IconPlaceholder({
  icon,
  className,
  ...props
}: {
  icon: IconName
  className?: string
}) {
  const iconLibrary = useDesignSystemParam("iconLibrary")

  return (
    <IconForIconLibrary
      iconLibrary={iconLibrary}
      icon={icon}
      className={className}
      {...props}
    />
  )
}

const IconPlaceholderMemoized = React.memo(
  ({
    iconLibrary,
    icon,
    className,
  }: {
    iconLibrary: IconLibraryName
    icon: IconName
    className?: string
  }) => {
    return (
      <IconForIconLibrary
        iconLibrary={iconLibrary}
        icon={icon}
        className={className}
      />
    )
  }
)

IconPlaceholderMemoized.displayName = "IconLoaderMemoized"
