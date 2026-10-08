/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { use } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

const iconPromiseCaches = new Map<string, Map<string, Promise<any>>>()

function getCache(libraryName: string) {
  if (!iconPromiseCaches.has(libraryName)) {
    iconPromiseCaches.set(libraryName, new Map())
  }
  return iconPromiseCaches.get(libraryName)!
}

function isIconData(data: any): data is IconSvgElement {
  return Array.isArray(data)
}

export function createIconLoader(libraryName: string) {
  const cache = getCache(libraryName)

  return function IconLoader({
    name,
    strokeWidth = 2,
    ...props
  }: {
    name: string
  } & React.ComponentProps<"svg">) {
    if (!cache.has(name)) {
      const promise = import(`./__${libraryName}__`).then((mod) => {
        const icon = mod[name as keyof typeof mod]
        return icon || null
      })
      cache.set(name, promise)
    }

    const iconData = use(cache.get(name)!)

    if (!iconData) {
      return null
    }

    if (isIconData(iconData)) {
      return <HugeiconsIcon icon={iconData} strokeWidth={2} {...props} />
    }

    const IconComponent = iconData
    return <IconComponent {...props} />
  }
}
