"use client"

import * as React from "react"

import { IconForIconLibrary, type IconLibrary } from "@/registry/icon-libraries"
import type { IconName } from "@/registry/icons"
import { useDesignSystemParam } from "@/app/(design)/hooks/use-design-system-sync"

export function IconPlaceholder({
  name,
  className,
}: {
  name: IconName
  className?: string
}) {
  const iconLibrary = useDesignSystemParam("iconLibrary")

  return (
    <IconForIconLibrary
      iconLibrary={iconLibrary}
      name={name}
      className={className}
    />
  )
}

const IconPlaceholderMemoized = React.memo(
  ({
    iconLibrary,
    name,
    className,
  }: {
    iconLibrary: IconLibrary
    name: IconName
    className?: string
  }) => {
    return (
      <IconForIconLibrary
        iconLibrary={iconLibrary}
        name={name}
        className={className}
      />
    )
  }
)

IconPlaceholderMemoized.displayName = "IconLoaderMemoized"
