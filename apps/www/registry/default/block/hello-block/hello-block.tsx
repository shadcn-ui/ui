"use client"

import { HelloCard } from "@/registry/default/block/hello-block/components/hello-card"
import { useMediaQuery } from "@/registry/default/hooks/use-media-query"
import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"

export default function HelloBlock() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <HelloCard
      title="Hello Block"
      className={cn(
        "p-12",
        isDesktop
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground"
      )}
    >
      <p>Hello. This is a component inside a block.</p>
      <p>You are currently on {isDesktop ? "desktop" : "mobile"}</p>
      <Button>Click me</Button>
    </HelloCard>
  )
}
