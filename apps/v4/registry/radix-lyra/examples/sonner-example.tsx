"use client"

import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/radix-lyra/components/example"
import { Button } from "@/registry/radix-lyra/ui/button"

export default function SonnerExample() {
  return (
    <ExampleWrapper>
      <SonnerBasic />
      <SonnerWithDescription />
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
