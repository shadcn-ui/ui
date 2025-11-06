"use client"

import * as React from "react"

import { IconForIconLibrary, type IconLibrary } from "@/registry/icon-libraries"
import type { IconName } from "@/registry/icons"
import { useDesignSystemParam } from "@/app/(app)/design/hooks/use-design-system-sync"

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
    iconLibrary: IconLibrary
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
