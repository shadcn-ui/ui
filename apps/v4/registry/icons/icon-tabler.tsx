"use client"

import * as React from "react"
import { use } from "react"

// Cache icon promises at module level to avoid re-loading.
const iconPromiseCache = new Map<string, Promise<any>>()

function getIconPromise(name: string) {
  if (iconPromiseCache.has(name)) {
    return iconPromiseCache.get(name)!
  }

  // Dynamically import from the generated __tabler__.ts file.
  // This enables proper tree-shaking while avoiding expensive template literal imports.
  const promise = import("./__tabler__").then((mod) => {
    const IconComponent = mod[name as keyof typeof mod]
    return IconComponent ? { default: IconComponent } : null
  })

  iconPromiseCache.set(name, promise)
  return promise
}

export function IconTabler({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  // Use cached promise to avoid re-loading icons.
  const iconModule = use(getIconPromise(name))

  if (!iconModule) {
    return null
  }

  const IconComponent = iconModule.default

  return React.createElement(
    IconComponent as unknown as React.ComponentType<{ className?: string }>,
    { className }
  )
}
