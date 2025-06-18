"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/registry/new-york-v4/ui/button"

const promiseCode = "`${data.name} toast has been added`"

const allTypes = [
  {
    name: "Default",
    snippet: `toast('Event has been created')`,
    action: () => toast("Event has been created"),
  },
  {
    name: "Description",
    snippet: `toast.message('Event has been created', {
  description: 'Monday, January 3rd at 6:00pm',
})`,
    action: () =>
      toast("Event has been created", {
        description: "Monday, January 3rd at 6:00pm",
      }),
  },
  {
    name: "Success",
    snippet: `toast.success('Event has been created')`,
    action: () => toast.success("Event has been created"),
  },
  {
    name: "Info",
    snippet: `toast.info('Be at the area 10 minutes before the event time')`,
    action: () => toast.info("Be at the area 10 minutes before the event time"),
  },
  {
    name: "Warning",
    snippet: `toast.warning('Event start time cannot be earlier than 8am')`,
    action: () => toast.warning("Event start time cannot be earlier than 8am"),
  },
  {
    name: "Error",
    snippet: `toast.error('Event has not been created')`,
    action: () => toast.error("Event has not been created"),
  },
  {
    name: "Action",
    action: () =>
      toast.message("Event has been created", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      }),
  },
  {
    name: "Cancel",
    action: () =>
      toast.message("Event has been created", {
        cancel: {
          label: "Cancel",
          onClick: () => console.log("Cancel"),
        },
      }),
  },
  {
    name: "Promise",
    snippet: `const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

toast.promise(promise, {
  loading: 'Loading...',
  success: (data) => {
    return ${promiseCode};
  },
  error: 'Error',
});`,
    action: () =>
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
      ),
  },
]

export function SonnerDemo() {
  const [activeType, setActiveType] = React.useState(allTypes[0])
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => toast("My first toast")} variant="outline">
        Give me a toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
      {allTypes.map((type) => (
        <Button
          variant="ghost"
          data-active={activeType.name === type.name}
          onClick={() => {
            type.action()
            setActiveType(type)
          }}
          key={type.name}
        >
          {type.name}
        </Button>
      ))}
    </div>
  )
}
