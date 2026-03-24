"use client"

import { Button } from "@/examples/ark/ui/button"
import { toast } from "@/examples/ark/ui/sonner"

export function SonnerPosition() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.create({
          title: "Event has been created",
          description: "The toast position is set on the Toaster component.",
        })
      }
    >
      Show Toast
    </Button>
  )
}
