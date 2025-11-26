"use client"

import * as React from "react"
import { toast } from "sonner"

import { CanvaFrame } from "@/components/canva"
import { Button } from "@/registry/bases/radix/ui/button"
import { Toaster } from "@/registry/bases/radix/ui/sonner"

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
    <CanvaFrame title="Basic">
      <Button
        onClick={() => toast("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </CanvaFrame>
  )
}

function SonnerWithDescription() {
  return (
    <CanvaFrame title="With Description">
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
    </CanvaFrame>
  )
}

function SonnerSuccess() {
  return (
    <CanvaFrame title="Success">
      <Button
        onClick={() => toast.success("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </CanvaFrame>
  )
}

function SonnerInfo() {
  return (
    <CanvaFrame title="Info">
      <Button
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time")
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </CanvaFrame>
  )
}

function SonnerWarning() {
  return (
    <CanvaFrame title="Warning">
      <Button
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am")
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </CanvaFrame>
  )
}

function SonnerError() {
  return (
    <CanvaFrame title="Error">
      <Button
        onClick={() => toast.error("Event has not been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </CanvaFrame>
  )
}

function SonnerWithAction() {
  return (
    <CanvaFrame title="With Action">
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
    </CanvaFrame>
  )
}

function SonnerWithCancel() {
  return (
    <CanvaFrame title="With Cancel">
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
    </CanvaFrame>
  )
}

function SonnerPromise() {
  return (
    <CanvaFrame title="Promise">
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
    </CanvaFrame>
  )
}
