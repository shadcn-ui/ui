"use client"

import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"

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
        onPress={() => toast("Event has been created")}
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
        onPress={() =>
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
          onPress={() => toast.success("Event has been created")}
          variant="outline"
          className="w-fit"
        >
          Success
        </Button>
        <Button
          onPress={() =>
            toast.info("Be at the area 10 minutes before the event time")
          }
          variant="outline"
          className="w-fit"
        >
          Info
        </Button>
        <Button
          onPress={() =>
            toast.warning("Event start time cannot be earlier than 8am")
          }
          variant="outline"
          className="w-fit"
        >
          Warning
        </Button>
        <Button
          onPress={() => toast.error("Event has not been created")}
          variant="outline"
          className="w-fit"
        >
          Error
        </Button>
      </div>
    </Example>
  )
}
