"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export type TimeValue = {
  hour: number
  minute: number
  second: number
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i + 1)
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const SECONDS = Array.from({ length: 60 }, (_, i) => i)

function hourToDisplay24(h: number) {
  return h === 0 ? 24 : h
}
function displayToHour24(d: number) {
  return d === 24 ? 0 : d
}

function hour24ToDisplay12(h24: number): { hour: number; isPM: boolean } {
  if (h24 === 0) return { hour: 12, isPM: false }
  if (h24 <= 11) return { hour: h24, isPM: false }
  if (h24 === 12) return { hour: 12, isPM: true }
  return { hour: h24 - 12, isPM: true }
}
function display12ToHour24(hour12: number, isPM: boolean): number {
  if (!isPM) return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}
function minuteToDisplay(m: number) {
  return m
}
function displayToMinute(d: number) {
  return d
}
function secondToDisplay(s: number) {
  return s
}
function displayToSecond(d: number) {
  return d
}

function TimeColumn({
  options,
  value,
  onSelect,
  label,
  className,
}: {
  options: number[]
  value: number
  onSelect: (n: number) => void
  label: string
  className?: string
}) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<Map<number, HTMLButtonElement | null>>(new Map())
  const valueNum = Number(value)

  React.useEffect(() => {
    const el = itemRefs.current.get(valueNum)
    if (el && listRef.current) {
      el.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [valueNum])

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-muted-foreground text-center text-xs font-medium sm:text-xs">
        {label}
      </span>
      <ScrollArea className="h-[180px] w-11 rounded-md border border-input sm:h-[200px] sm:w-12">
        <div
          ref={listRef}
          className="flex flex-col items-center gap-0.5 py-2"
          role="listbox"
          aria-label={label}
        >
          {options.map((n) => {
            const nNum = Number(n)
            const isSelected = valueNum === nNum
            return (
              <Button
                key={`${label}-${n}`}
                ref={(el: HTMLButtonElement | null) => {
                  itemRefs.current.set(nNum, el)
                }}
                variant={isSelected ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-9 min-w-0 touch-manipulation rounded-md px-2 text-sm font-normal sm:h-8",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
                onClick={() => onSelect(nNum)}
                role="option"
                aria-selected={isSelected}
              >
                {String(n).padStart(2, "0")}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export interface DateFieldProps
  extends Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect"
  > {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  className?: string
  use12Hour?: boolean
}

function DateField({
  value,
  onValueChange,
  className,
  use12Hour = false,
  ...calendarProps
}: DateFieldProps) {
  const date = value ?? new Date()
  const h24 = date.getHours()

  const [hour24, setHour24] = React.useState(hourToDisplay24(h24))
  const [hour12, setHour12] = React.useState(hour24ToDisplay12(h24).hour)
  const [isPM, setIsPM] = React.useState(hour24ToDisplay12(h24).isPM)
  const [minute, setMinute] = React.useState(minuteToDisplay(date.getMinutes()))
  const [second, setSecond] = React.useState(secondToDisplay(date.getSeconds()))

  const selectedDate = value ? new Date(value) : undefined

  React.useEffect(() => {
    if (value) {
      const h = value.getHours()
      setHour24(hourToDisplay24(h))
      const d12 = hour24ToDisplay12(h)
      setHour12(d12.hour)
      setIsPM(d12.isPM)
      setMinute(minuteToDisplay(value.getMinutes()))
      setSecond(secondToDisplay(value.getSeconds()))
    }
  }, [value?.getTime()])

  const updateTime = React.useCallback(
    (h: number, m: number, s: number) => {
      const base = selectedDate ?? new Date()
      const next = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        h,
        m,
        s
      )
      onValueChange?.(next)
    },
    [selectedDate, onValueChange]
  )

  const getHour24 = React.useCallback(() => {
    if (use12Hour) return display12ToHour24(hour12, isPM)
    return displayToHour24(hour24)
  }, [use12Hour, hour12, isPM, hour24])

  const handleDateSelect = React.useCallback(
    (d: Date | undefined) => {
      if (!d) {
        onValueChange?.(undefined)
        return
      }
      const next = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        getHour24(),
        displayToMinute(minute),
        displayToSecond(second)
      )
      onValueChange?.(next)
    },
    [getHour24, minute, second, onValueChange]
  )

  const handleHourSelect24 = React.useCallback(
    (h: number) => {
      setHour24(h)
      updateTime(displayToHour24(h), displayToMinute(minute), displayToSecond(second))
    },
    [minute, second, updateTime]
  )

  const handleHourSelect12 = React.useCallback(
    (h: number) => {
      setHour12(h)
      updateTime(display12ToHour24(h, isPM), displayToMinute(minute), displayToSecond(second))
    },
    [isPM, minute, second, updateTime]
  )

  const handleAmPmSelect = React.useCallback(
    (pm: boolean) => {
      setIsPM(pm)
      updateTime(display12ToHour24(hour12, pm), displayToMinute(minute), displayToSecond(second))
    },
    [hour12, minute, second, updateTime]
  )

  const handleMinuteSelect = React.useCallback(
    (m: number) => {
      setMinute(m)
      updateTime(getHour24(), displayToMinute(m), displayToSecond(second))
    },
    [getHour24, second, updateTime]
  )

  const handleSecondSelect = React.useCallback(
    (s: number) => {
      setSecond(s)
      updateTime(getHour24(), displayToMinute(minute), displayToSecond(s))
    },
    [getHour24, minute, updateTime]
  )

  return (
    <div
      data-slot="date-field"
      className={cn(
        "flex w-fit flex-col items-center gap-3 rounded-lg border border-input bg-background p-3 sm:flex-row sm:gap-0",
        className
      )}
    >
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        captionLayout="dropdown"
        className="rounded-lg border-0 bg-transparent p-0"
        {...calendarProps}
      />
      <div className="flex shrink-0 flex-row items-stretch justify-center gap-2 border-t border-input pt-3 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
        {use12Hour ? (
          <>
            <TimeColumn
              key="hour12"
              label="Hour"
              options={HOURS_12}
              value={hour12}
              onSelect={handleHourSelect12}
            />
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-center text-xs font-medium sm:text-xs">
                AM/PM
              </span>
              <div className="flex flex-col gap-0.5">
                <Button
                  variant={!isPM ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 w-9 min-w-0 touch-manipulation rounded-md px-2 text-xs font-normal sm:h-8",
                    !isPM && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                  onClick={() => handleAmPmSelect(false)}
                >
                  AM
                </Button>
                <Button
                  variant={isPM ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 w-9 min-w-0 touch-manipulation rounded-md px-2 text-xs font-normal sm:h-8",
                    isPM && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                  onClick={() => handleAmPmSelect(true)}
                >
                  PM
                </Button>
              </div>
            </div>
          </>
        ) : (
          <TimeColumn
            key="hour24"
            label="Hour"
            options={HOURS_24}
            value={hour24}
            onSelect={handleHourSelect24}
          />
        )}
        <TimeColumn
          key="minute"
          label="Min"
          options={MINUTES}
          value={minute}
          onSelect={handleMinuteSelect}
        />
        <TimeColumn
          key="second"
          label="Sec"
          options={SECONDS}
          value={second}
          onSelect={handleSecondSelect}
        />
      </div>
    </div>
  )
}

export interface TimeFieldProps {
  value: TimeValue
  onValueChange?: (value: TimeValue) => void
  className?: string
}

function TimeField({ value, onValueChange, className }: TimeFieldProps) {
  const [hour, setHour] = React.useState(hourToDisplay24(value.hour))
  const [minute, setMinute] = React.useState(minuteToDisplay(value.minute))
  const [second, setSecond] = React.useState(secondToDisplay(value.second))

  React.useEffect(() => {
    setHour(hourToDisplay24(value.hour))
    setMinute(minuteToDisplay(value.minute))
    setSecond(secondToDisplay(value.second))
  }, [value.hour, value.minute, value.second])

  const update = React.useCallback(
    (h: number, m: number, s: number) => {
      onValueChange?.({
        hour: displayToHour24(h),
        minute: displayToMinute(m),
        second: displayToSecond(s),
      })
    },
    [onValueChange]
  )

  return (
    <div
      data-slot="time-field"
      className={cn(
        "flex w-fit flex-row justify-center gap-2 rounded-lg border border-input bg-background p-3",
        className
      )}
    >
      <TimeColumn
        label="Hour"
        options={HOURS_24}
        value={hour}
        onSelect={(h) => {
          setHour(h)
          update(h, minute, second)
        }}
      />
      <TimeColumn
        label="Min"
        options={MINUTES}
        value={minute}
        onSelect={(m) => {
          setMinute(m)
          update(hour, m, second)
        }}
      />
      <TimeColumn
        label="Sec"
        options={SECONDS}
        value={second}
        onSelect={(s) => {
          setSecond(s)
          update(hour, minute, s)
        }}
      />
    </div>
  )
}

export { DateField, TimeField }
