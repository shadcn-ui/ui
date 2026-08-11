"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Button } from "@/registry/bases/ark/ui/button"
import { Toaster, toast } from "@/registry/bases/ark/ui/toast"

export default function ToastExample() {
  return (
    <ExampleWrapper>
      <ToastBasic />
      <ToastWithDescription />
      <Toaster />
    </ExampleWrapper>
  )
}

function ToastBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Button
        onClick={() => toast.create({ title: "Event has been created" })}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastWithDescription() {
  return (
    <Example title="With Description" className="items-center justify-center">
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
    </Example>
  )
}
