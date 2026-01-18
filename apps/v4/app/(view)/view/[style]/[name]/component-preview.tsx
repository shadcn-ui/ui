"use client"

import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

export function ComponentPreview({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const theme = searchParams.get("theme") ?? "default"

  return (
    <div
      className={cn(
        "bg-background *:data-[slot=card]:has-[[data-slot=chart]]:shadow-none",
        `theme-${theme}`,
        theme.endsWith("-scaled") && "theme-scaled"
      )}
    >
      <div className="theme-container">{children}</div>
    </div>
  )
}
