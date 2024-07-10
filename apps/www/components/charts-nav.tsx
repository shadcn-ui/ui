"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"

const examples = [
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
]

export function ChartsNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname()

  return (
    <div className="relative px-1 pb-4 md:px-0 md:pb-0">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div
          className={cn(
            "flex flex-col gap-2 sm:items-center md:flex-row",
            className
          )}
          {...props}
        >
          {examples.map((example, index) => (
            <Link
              href={example.href}
              key={example.href}
              className={cn(
                "flex h-7 rounded-full px-4 text-left text-sm transition-colors hover:text-primary sm:items-center sm:justify-center sm:text-center",
                pathname?.startsWith(example.href) ||
                  (index === 0 && pathname === "/")
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
    </div>
  )
}
