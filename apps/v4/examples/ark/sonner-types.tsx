"use client"

import { Button } from "@/examples/ark/ui/button"
import { toast } from "@/examples/ark/ui/sonner"

export function SonnerTypes() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast.create({ title: "Event has been created" })}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success({ title: "Event has been created" })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info({
            title: "Be at the area 10 minutes before the event time",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning({
            title: "Event start time cannot be earlier than 8am",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error({ title: "Event has not been created" })}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.loading({ title: "Loading..." })
          setTimeout(() => {
            toast.success({ title: "Event has been created" })
          }, 2000)
        }}
      >
        Promise
      </Button>
    </div>
  )
}
