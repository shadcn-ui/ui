"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastStatus,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export const ToastDemo = () => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<ToastStatus>("default")
  const eventDateRef = useRef(new Date())
  const timerRef = useRef(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <RadioGroup
        defaultValue="default"
        onValueChange={(v) => setStatus(v as ToastStatus)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="r1" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="success" id="r2" />
          <Label htmlFor="r2">Success</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="error" id="r3" />
          <Label htmlFor="r3">Error</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="info" id="r4" />
          <Label htmlFor="r4">Info</Label>
        </div>
      </RadioGroup>
      <Button
        onClick={() => {
          setOpen(true)
          window.clearTimeout(timerRef.current)
          timerRef.current = window.setTimeout(() => {
            eventDateRef.current = oneWeekAway()
            setOpen(true)
          }, 100)
        }}
      >
        Add to calendar
      </Button>
      <ToastProvider>
        <Toast open={open} onOpenChange={setOpen} status={status}>
          <div className="mb-2">
            <ToastTitle>Scheduled: Catch up</ToastTitle>
            <ToastDescription>
              <time
                className="ToastDescription"
                dateTime={eventDateRef.current.toISOString()}
              >
                {prettyDate(eventDateRef.current)}
              </time>
            </ToastDescription>
          </div>
          <ToastAction altText="undo">Undo</ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    </div>
  )
}

function oneWeekAway() {
  const now = new Date()
  const inOneWeek = now.setDate(now.getDate() + 7)
  return new Date(inOneWeek)
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date)
}
function uuseRef(arg0: Date) {
  throw new Error("Function not implemented.")
}
