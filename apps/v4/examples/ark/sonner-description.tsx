"use client"

import { Button } from "@/examples/ark/ui/button"
import { toast } from "@/examples/ark/ui/sonner"

export function SonnerDescription() {
  return (
    <Button
      onClick={() =>
        toast.create({
          title: "Event has been created",
          description: "Monday, January 3rd at 6:00pm",
        })
      }
      variant="outline"
      className="w-fit"
    >
      Show Toast
    </Button>
  )
}
