"use client"

import { Button } from "@/examples/ark/ui/button"
import { toast } from "@/examples/ark/ui/sonner"

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.create({
          title: "Event has been created",
          description: "Sunday, December 03, 2023 at 9:00 AM",
        })
      }
    >
      Show Toast
    </Button>
  )
}
