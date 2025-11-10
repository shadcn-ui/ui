"use client"

import { use } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { loadIcon } from "@hugeicons/core-free-icons/loader"

// Cache icon promises at module level to avoid re-loading.
const iconPromiseCache = new Map<string, Promise<any>>()

function getIconPromise(name: string) {
  if (iconPromiseCache.has(name)) {
    return iconPromiseCache.get(name)!
  }

  const promise = loadIcon(name).catch((error) => {
    console.warn(`Icon "${name}" not found in @hugeicons/core-free-icons:`, error)
    return null
  })

  iconPromiseCache.set(name, promise)
  return promise
}

export function IconHugeicons({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  // Use cached promise to avoid re-loading icons.
  const iconData = use(getIconPromise(name))

  if (!iconData) {
    return null
  }

  return (
    <HugeiconsIcon
      icon={iconData as IconSvgElement}
      strokeWidth={2}
      className={className}
    />
  )
}
