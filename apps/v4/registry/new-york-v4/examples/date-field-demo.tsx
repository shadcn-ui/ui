"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { DateField } from "../ui/date-field"
import { Button } from "../ui/button"


function formatDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = date.toLocaleString("en-GB", { month: "short" })
  const year = date.getFullYear()
  const h = String(date.getHours()).padStart(2, "0")
  const m = String(date.getMinutes()).padStart(2, "0")
  const s = String(date.getSeconds()).padStart(2, "0")
  return `${day} ${month} ${year} , ${h}:${m}:${s}`
}

export function DateFieldDemo() {
  const [value, setValue] = React.useState<Date | undefined>(() => new Date())
  const [open, setOpen] = React.useState(false)

  const setDateKeepTime = React.useCallback(
    (newDate: Date) => {
      if (!value) {
        setValue(newDate)
        return
      }
      const next = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        value.getHours(),
        value.getMinutes(),
        value.getSeconds()
      )
      setValue(next)
    },
    [value]
  )

  const setTimeNow = React.useCallback(() => {
    const now = new Date()
    if (!value) {
      setValue(now)
      return
    }
    const next = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    )
    setValue(next)
  }, [value])

  const yesterday = React.useCallback(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    setDateKeepTime(d)
  }, [setDateKeepTime])

  const today = React.useCallback(() => {
    setDateKeepTime(new Date())
  }, [setDateKeepTime])

  const tomorrow = React.useCallback(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    setDateKeepTime(d)
  }, [setDateKeepTime])

  const displayText = value ? formatDateTime(value) : "Select date and time"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm touch-manipulation sm:h-10 sm:w-auto sm:min-w-[300px]",
            "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {displayText}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-auto max-w-[calc(100vw-2rem)] p-0"
        sideOffset={6}
      >
        <div className="flex flex-col items-center">
          {/* Row 1: Calendar (left) + Time columns (right) */}
          <DateField
            value={value}
            onValueChange={setValue}
            captionLayout="dropdown"
          />

          {/* Row 2: Left = Yesterday, Today, Tomorrow. Right = Now */}
          <div className="flex w-full flex-col gap-2 border-t border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="touch-manipulation text-xs"
                onClick={yesterday}
              >
                Yesterday
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="touch-manipulation text-xs"
                onClick={today}
              >
                Today
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="touch-manipulation text-xs"
                onClick={tomorrow}
              >
                Tomorrow
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="touch-manipulation text-xs"
              onClick={setTimeNow}
            >
              Now
            </Button>
          </div>

          {/* Footer */}
          <footer className="w-full border-t border-border bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground">
            Date & time picker — select date and time above
          </footer>
        </div>
      </PopoverContent>
    </Popover>
  )
}
