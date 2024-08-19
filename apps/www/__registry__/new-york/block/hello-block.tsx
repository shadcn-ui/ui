"use client"

import { useMediaQuery } from "@/registry/new-york/hooks/use-media-query"
import { cn } from "@/registry/new-york/lib/utils"
import { Button } from "@/registry/new-york/ui/button"

export default function ExampleBlock() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div
      className={cn(
        "p-12",
        isDesktop
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground"
      )}
    >
      <Button>A button</Button>
    </div>
  )
}
