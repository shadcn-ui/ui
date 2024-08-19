"use client"

import { useMediaQuery } from "@/registry/default/hooks/use-media-query"
import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"

export default function ExampleBlock() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div
      className={cn(
        "shadow-brand p-12",
        isDesktop
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground"
      )}
    >
      <Button className="bg-brand-primary border-brand-secondary border-4">
        A button
      </Button>
    </div>
  )
}
