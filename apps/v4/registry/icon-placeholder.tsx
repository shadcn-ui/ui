"use client"

import * as React from "react"
import { useQueryState } from "nuqs"

import { IconForIconLibrary, type IconLibrary } from "@/registry/icon-libraries"
import type { IconName } from "@/registry/icons"
import { designSystemSearchParams } from "@/app/(new)/lib/search-params"

export function IconPlaceholder({
  name,
  className,
}: {
  name: IconName
  className?: string
}) {
  const [iconLibrary] = useQueryState(
    "iconLibrary",
    designSystemSearchParams.iconLibrary
  )
  return (
    <IconPlaceholderMemoized
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
