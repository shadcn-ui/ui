import Link from "next/link"

import { PAGES_NEW } from "@/lib/docs"
import {
  getPagesFromFolder,
  type PageTreeFolder,
  type PageTreePage,
} from "@/lib/page-tree"

function ComponentLink({
  component,
  showNewIndicator,
}: {
  component: PageTreePage
  showNewIndicator: boolean
}) {
  const isNew = showNewIndicator && PAGES_NEW.includes(component.url)

  return (
    <Link
      href={component.url}
      className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
    >
      {component.name}
      {isNew && (
        <>
          <span className="sr-only">New</span>
          <span
            aria-hidden="true"
            className="flex size-2 rounded-full bg-blue-500"
          />
        </>
      )}
    </Link>
  )
}

export function ComponentsList({
  componentsFolder,
  currentBase,
  variant = "all",
}: {
  componentsFolder: PageTreeFolder
  currentBase: string
  variant?: "all" | "new"
}) {
  const list = getPagesFromFolder(componentsFolder, currentBase).filter(
    (component) => variant === "all" || PAGES_NEW.includes(component.url)
  )

  if (!list.length) {
    return null
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {list.map((component) => (
        <ComponentLink
          key={component.$id}
          component={component}
          showNewIndicator={variant === "all"}
        />
      ))}
    </div>
  )
}
