"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { useFragmentIdentifier } from "@/hooks/use-fragment-identifier"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"

const links = [
  {
    name: "Area Chart",
    href: "/charts#area-chart",
  },
  {
    name: "Bar Chart",
    href: "/charts#bar-chart",
  },
  {
    name: "Line Chart",
    href: "/charts#line-chart",
  },
  {
    name: "Pie Chart",
    href: "/charts#pie-chart",
  },
  {
    name: "Radar Chart",
    href: "/charts#radar-chart",
  },
  {
    name: "Radial Chart",
    href: "/charts#radial-chart",
  },
  {
    name: "Tooltip",
    href: "/charts#tooltip",
  },
]

const fragmentIdentifiers = links.map((link) => link.href.split("#")[1])

export function ChartsNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const fragmentIdentifier = useFragmentIdentifier()
  const [sections, setSections] = useState<(HTMLElement | null)[]>([])

  useEffect(() => {
    const sectionDomElements = fragmentIdentifiers.map((id) =>
      document.getElementById(id)
    )
    setSections(sectionDomElements)
  }, [])

  useIntersectionObserver({
    config: { rootMargin: "0px 0px -75% 0px", threshold: [0, 0.05, 0.1] },
    htmlElements: sections,
    onIntersect: (entry) => {
      fragmentIdentifier?.setFragment(`#${entry.target.id}`)
    },
  })

  return (
    <ScrollArea className="max-w-[calc(100vw-2rem)]">
      <div className={cn("flex items-center", className)} {...props}>
        {links.map((example) => (
          <Link
            href={example.href}
            key={example.href}
            className={cn(
              "flex h-7 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
              fragmentIdentifier?.fragment &&
                example.href.endsWith(fragmentIdentifier.fragment)
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )}
          >
            {example.name}
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}
