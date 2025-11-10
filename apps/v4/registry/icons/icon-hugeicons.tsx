"use client"

import { use } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"

// Cache icon promises at module level to avoid re-loading.
const iconPromiseCache = new Map<string, Promise<any>>()

function getIconPromise(name: string) {
  if (iconPromiseCache.has(name)) {
    return iconPromiseCache.get(name)!
  }

  // Dynamically import from the generated __hugeicons__.ts file.
  // This enables proper tree-shaking while avoiding expensive template literal imports.
  const promise = import("./__hugeicons__").then((mod) => {
    const iconData = mod[name as keyof typeof mod]
    return iconData || null
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
