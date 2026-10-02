"use client"

import { Button } from "@/styles/ark-nova/ui/button"
import { toast } from "@/styles/ark-nova/ui/toast"

export function ToastPosition() {
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
