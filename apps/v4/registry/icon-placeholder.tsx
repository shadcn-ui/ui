"use client"

import * as React from "react"
import { useQueryState } from "nuqs"

import { IconForIconLibrary, type IconLibrary } from "@/registry/icon-libraries"
import type { IconName } from "@/registry/icons"
import { designSystemSearchParams } from "@/app/(new)/lib/search-params"

export function IconPlaceholder({ name }: { name: IconName }) {
  const [iconLibrary] = useQueryState(
    "iconLibrary",
    designSystemSearchParams.iconLibrary
  )
  return <IconPlaceholderMemoized iconLibrary={iconLibrary} name={name} />
}

const IconPlaceholderMemoized = React.memo(
  ({ iconLibrary, name }: { iconLibrary: IconLibrary; name: IconName }) => {
    return <IconForIconLibrary iconLibrary={iconLibrary} name={name} />
  }
)

IconPlaceholderMemoized.displayName = "IconLoaderMemoized"
