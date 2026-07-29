"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import { toast } from "@/registry/bases/base/ui/toast"

export default function ToastExample() {
  return (
    <ExampleWrapper>
      <ToastBasic />
      <ToastWithAction />
      <ToastPromise />
    </ExampleWrapper>
  )
}

function ToastBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Button
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast.add({
            title: "Event created",
            description: "Sunday, December 3 at 9:00 AM",
          })
        }
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastWithAction() {
  function showToast() {
    const id = toast.add({
      title: "Event created",
      description: "You can undo this action.",
      actionProps: {
        children: "Undo",
        onClick() {
          toast.close(id)
          toast.add({
            description: "Event creation undone.",
          })
        },
      },
    })
  }

  return (
    <Example title="With Action" className="items-center justify-center">
      <Button variant="outline" className="w-fit" onClick={showToast}>
        Show Toast
      </Button>
    </Example>
  )
}

function ToastPromise() {
  function showToast() {
    toast.promise(
      new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: "Event" }), 2000)
      }),
      {
        loading: "Creating event…",
        success: (data) => `${data.name} created.`,
        error: "Could not create event.",
      }
    )
  }

  return (
    <Example title="Promise" className="items-center justify-center">
      <Button variant="outline" className="w-fit" onClick={showToast}>
        Create Event
      </Button>
    </Example>
  )
}
