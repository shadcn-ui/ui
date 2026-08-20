"use client"

import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Button } from "@/registry/bases/radix/ui/button"

export default function SonnerExample() {
  return (
    <ExampleWrapper>
      <SonnerBasic />
      <SonnerWithDescription />
      <SonnerWithIcons />
    </ExampleWrapper>
  )
}

function SonnerBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Button
        onClick={() => toast("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerWithDescription() {
  return (
    <Example title="With Description" className="items-center justify-center">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Monday, January 3rd at 6:00pm",
          })
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerWithIcons() {
  return (
    <Example title="With Icons" className="items-center justify-center">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => toast.success("Event has been created")}
          variant="outline"
          className="w-fit"
        >
          Success
        </Button>
        <Button
          onClick={() =>
            toast.info("Be at the area 10 minutes before the event time")
          }
          variant="outline"
          className="w-fit"
        >
          Info
        </Button>
        <Button
          onClick={() =>
            toast.warning("Event start time cannot be earlier than 8am")
          }
          variant="outline"
          className="w-fit"
        >
          Warning
        </Button>
        <Button
          onClick={() => toast.error("Event has not been created")}
          variant="outline"
          className="w-fit"
        >
          Error
        </Button>
      </div>
    </Example>
  )
}
