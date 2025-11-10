"use client"

import * as React from "react"
import { use } from "react"

// Cache icon promises at module level to avoid re-loading.
const iconPromiseCache = new Map<string, Promise<any>>()

function getIconPromise(name: string) {
  if (iconPromiseCache.has(name)) {
    return iconPromiseCache.get(name)!
  }

  const promise = import(`@tabler/icons-react/dist/esm/icons/${name}.mjs`)
    .then((mod) => mod)
    .catch((error) => {
      console.warn(`Icon "${name}" not found in @tabler/icons-react:`, error)
      return null
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
