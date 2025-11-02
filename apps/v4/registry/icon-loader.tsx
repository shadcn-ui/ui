"use client"

import * as React from "react"
import { useQueryState } from "nuqs"

import { IconForIconLibrary, type IconLibrary } from "@/registry/icon-libraries"
import type { IconName } from "@/registry/icons"
import { parseAsIconLibrary } from "@/app/(new)/lib/search-params"

export function IconLoader({ name }: { name: IconName }) {
  const [iconLibrary] = useQueryState(
    "iconLibrary",
    parseAsIconLibrary.withDefault("lucide")
  )
  return <IconLoaderMemoized iconLibrary={iconLibrary} name={name} />
}

const IconLoaderMemoized = React.memo(
  ({ iconLibrary, name }: { iconLibrary: IconLibrary; name: IconName }) => {
    return <IconForIconLibrary iconLibrary={iconLibrary} name={name} />
  }
)

IconLoaderMemoized.displayName = "IconLoaderMemoized"
