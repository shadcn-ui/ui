"use client"

import { Button } from "@/styles/ark-nova/ui/button"
import { toast } from "@/styles/ark-nova/ui/toast"

export function ToastDemo() {
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
