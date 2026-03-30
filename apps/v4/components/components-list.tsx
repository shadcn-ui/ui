"use client"

import Link from "next/link"

import { PAGES_NEW } from "@/lib/docs"
import {
  getPagesFromFolder,
  type PageTreeFolder,
  type PageTreePage,
} from "@/lib/page-tree"
import { cn } from "@/lib/utils"
import { useFramework } from "@/hooks/use-framework"
import { getDefaultBaseForFramework } from "@/registry/frameworks"

export function ComponentsList({
  componentsFolder,
}: {
  componentsFolder: PageTreeFolder
}) {
  const { framework } = useFramework()
  const currentBase = getDefaultBaseForFramework(framework)

  // Get the canonical list (radix has all components).
  const allComponents = getPagesFromFolder(componentsFolder, "radix")

  // Get the available list for the current base.
  const availableComponents = getPagesFromFolder(componentsFolder, currentBase)
  const availableNames = new Set(availableComponents.map((p) => p.name))

  // For non-React frameworks, build a URL map for available components.
  const availableUrlMap = new Map<string, string>()
  for (const page of availableComponents) {
    availableUrlMap.set(page.name, page.url)
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {allComponents.map((component) => {
        const isAvailable = availableNames.has(component.name)
        const href = availableUrlMap.get(component.name) ?? component.url

        if (!isAvailable) {
          return (
            <span
              key={component.$id}
              className="inline-flex items-center gap-2 text-lg font-medium text-muted-foreground/50 md:text-base"
            >
              {component.name}
              <span className="rounded-md border border-border/50 px-1.5 py-0.5 text-[10px] leading-none font-medium text-muted-foreground/50">
                Soon
              </span>
            </span>
          )
        }

        return (
          <Link
            key={component.$id}
            href={href}
            className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
          >
            {component.name}
            {PAGES_NEW.includes(component.url) && (
              <span
                className="flex size-2 rounded-full bg-blue-500"
                title="New"
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
