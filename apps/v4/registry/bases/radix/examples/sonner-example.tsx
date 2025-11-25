"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/registry/bases/radix/ui/button"
import { Toaster } from "@/registry/bases/radix/ui/sonner"
import Frame from "@/app/(design)/design/components/frame"

export default function SonnerExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SonnerBasic />
        <SonnerWithDescription />
        <SonnerSuccess />
        <SonnerInfo />
        <SonnerWarning />
        <SonnerError />
        <SonnerWithAction />
        <SonnerWithCancel />
        <SonnerPromise />
        <Toaster position="top-center" />
      </div>
    </div>
  )
}

function SonnerBasic() {
  return (
    <Frame title="Basic">
      <Button
        onClick={() => toast("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Frame>
  )
}

function SonnerWithDescription() {
  return (
    <Frame title="With Description">
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
    </Frame>
  )
}

function SonnerSuccess() {
  return (
    <Frame title="Success">
      <Button
        onClick={() => toast.success("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Frame>
  )
}

function SonnerInfo() {
  return (
    <Frame title="Info">
      <Button
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time")
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Frame>
  )
}

function SonnerWarning() {
  return (
    <Frame title="Warning">
      <Button
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am")
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Frame>
  )
}

function SonnerError() {
  return (
    <Frame title="Error">
      <Button
        onClick={() => toast.error("Event has not been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Frame>
  )
}

function SonnerWithAction() {
  return (
    <Frame title="With Action">
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
    </Frame>
  )
}

function SonnerWithCancel() {
  return (
    <Frame title="With Cancel">
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
    </Frame>
  )
}

function SonnerPromise() {
  return (
    <Frame title="Promise">
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
    </Frame>
  )
}
