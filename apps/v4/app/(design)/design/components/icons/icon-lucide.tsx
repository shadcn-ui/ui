"use client"

import * as React from "react"
import { use } from "react"
import dynamicIconImports from "lucide-react/dynamicIconImports"

// Convert PascalCase icon name to kebab-case (CopyIcon -> copy).
function toKebabCase(str: string): string {
  return str
    .replace(/Icon$/, "") // Remove "Icon" suffix
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Add dash between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Handle consecutive capitals
    .replace(/([a-zA-Z])(\d)/g, "$1-$2") // Add dash before numbers
    .toLowerCase()
}

// Cache icon promises at module level to avoid re-loading.
const iconPromiseCache = new Map<string, Promise<any>>()

function getIconPromise(name: string) {
  const kebabName = toKebabCase(name)

  if (iconPromiseCache.has(kebabName)) {
    return iconPromiseCache.get(kebabName)!
  }

  const iconImportFn = dynamicIconImports[kebabName as keyof typeof dynamicIconImports]

  if (!iconImportFn) {
    console.warn(`Icon "${name}" (${kebabName}) not found in lucide-react`)
    const nullPromise = Promise.resolve(null)
    iconPromiseCache.set(kebabName, nullPromise)
    return nullPromise
  }

  const promise = iconImportFn()
  iconPromiseCache.set(kebabName, promise)
  return promise
}

export function IconLucide({
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
