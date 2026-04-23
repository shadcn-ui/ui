"use client"

import Link from "next/link"

import { PAGES_NEW } from "@/lib/docs"
import { getPagesFromFolder, type PageTreeFolder } from "@/lib/page-tree"
import { useConfig } from "@/hooks/use-config"
import React from "react"

// Links for each component, currentBase is setted to the last selected base or default to radix.
export function ComponentsList({
  componentsFolder,
}: {
  componentsFolder: PageTreeFolder
}) {
  const [config] = useConfig()

  const currentBase = React.useMemo(() => {
    return config.currentBase || "radix"
  }, [config])
  
  const list = getPagesFromFolder(componentsFolder, currentBase)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {list.map((component) => (
        <Link
          key={component.$id}
          href={component.url}
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
      ))}
    </div>
  )
}
