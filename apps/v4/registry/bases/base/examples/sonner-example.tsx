"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import { Toaster } from "@/registry/bases/base/ui/sonner"

export default function SonnerExample() {
  return (
    <ExampleWrapper>
      <SonnerBasic />
      <SonnerWithDescription />
      <SonnerSuccess />
      <SonnerInfo />
      <SonnerWarning />
      <SonnerError />
      <SonnerWithAction />
      <SonnerWithCancel />
      <SonnerPromise />
    </ExampleWrapper>
  )
}

function SonnerBasic() {
  return (
    <Example title="Basic">
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
    <Example title="With Description">
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

function SonnerSuccess() {
  return (
    <Example title="Success">
      <Button
        onClick={() => toast.success("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerInfo() {
  return (
    <Example title="Info">
      <Button
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time")
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerWarning() {
  return (
    <Example title="Warning">
      <Button
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am")
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerError() {
  return (
    <Example title="Error">
      <Button
        onClick={() => toast.error("Event has not been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerWithAction() {
  return (
    <Example title="With Action">
      <Button
        onClick={() =>
          toast("Event has been created", {
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
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

function SonnerWithCancel() {
  return (
    <Example title="With Cancel">
      <Button
        onClick={() =>
          toast("Event has been created", {
            cancel: {
              label: "Cancel",
              onClick: () => console.log("Cancel"),
            },
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

function SonnerPromise() {
  return (
    <Example title="Promise">
      <Button
        onClick={() =>
          toast.promise<{ name: string }>(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve({ name: "Sonner" })
                }, 2000)
              }),
            {
              loading: "Loading...",
              success: (data) => {
                return `${data.name} toast has been added`
              },
              error: "Error",
            }
          )
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}
