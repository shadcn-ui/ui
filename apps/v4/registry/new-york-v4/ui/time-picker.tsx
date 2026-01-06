"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

type TimePickerGranularity = "hour" | "minute" | "second"

type Period = "am" | "pm"

type TimePickerProps = {
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date) => void
  hourCycle?: 12 | 24
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  granularity?: TimePickerGranularity
  hideLabels?: boolean
  disabled?: boolean
} & Omit<React.ComponentProps<"div">, "onChange" | "defaultValue">

function TimePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  hourCycle = 12,
  hourStep = 1,
  minuteStep = 5,
  secondStep = 1,
  granularity = "minute",
  hideLabels = false,
  disabled = false,
  ...props
}: TimePickerProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(
    defaultValue
  )
  const fallbackDate = React.useMemo(
    () => (defaultValue ? new Date(defaultValue) : new Date()),
    [defaultValue]
  )
  const resolvedValue = React.useMemo(
    () => value ?? internalValue ?? fallbackDate,
    [value, internalValue, fallbackDate]
  )

  const handleValueChange = React.useCallback(
    (next: Date) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const period: Period = resolvedValue.getHours() >= 12 ? "pm" : "am"
  const hour24 = resolvedValue.getHours()
  const minute = resolvedValue.getMinutes()
  const second = resolvedValue.getSeconds()

  const displayHour =
    hourCycle === 12
      ? hour24 % 12 === 0
        ? 12
        : hour24 % 12
      : hour24

  const hourValue = displayHour.toString().padStart(2, "0")
  const minuteValue = minute.toString().padStart(2, "0")
  const secondValue = second.toString().padStart(2, "0")

  const showMinutes = granularity === "minute" || granularity === "second"
  const showSeconds = granularity === "second"

  const hourOptions = React.useMemo(() => {
    const hours: { value: string; label: string }[] = []

    if (hourCycle === 12) {
      for (let h = 1; h <= 12; h += Math.max(1, hourStep)) {
        const value = h.toString().padStart(2, "0")
        hours.push({ value, label: value })
      }

      if (!hours.some((option) => option.value === hourValue)) {
        hours.push({ value: hourValue, label: hourValue })
      }

      return hours.sort((a, b) => Number(a.value) - Number(b.value))
    }

    for (let h = 0; h < 24; h += Math.max(1, hourStep)) {
      const value = h.toString().padStart(2, "0")
      hours.push({ value, label: value })
    }

    if (!hours.some((option) => option.value === hourValue)) {
      hours.push({ value: hourValue, label: hourValue })
    }

    return hours.sort((a, b) => Number(a.value) - Number(b.value))
  }, [hourCycle, hourStep, hourValue])

  const minuteOptions = React.useMemo(() => {
    const minutes: { value: string; label: string }[] = []

    for (let m = 0; m < 60; m += Math.max(1, minuteStep)) {
      const value = m.toString().padStart(2, "0")
      minutes.push({ value, label: value })
    }

    if (!minutes.some((option) => option.value === minuteValue)) {
      minutes.push({ value: minuteValue, label: minuteValue })
    }

    return minutes.sort((a, b) => Number(a.value) - Number(b.value))
  }, [minuteStep, minuteValue])

  const secondOptions = React.useMemo(() => {
    const seconds: { value: string; label: string }[] = []

    for (let s = 0; s < 60; s += Math.max(1, secondStep)) {
      const value = s.toString().padStart(2, "0")
      seconds.push({ value, label: value })
    }

    if (!seconds.some((option) => option.value === secondValue)) {
      seconds.push({ value: secondValue, label: secondValue })
    }

    return seconds.sort((a, b) => Number(a.value) - Number(b.value))
  }, [secondStep, secondValue])

  const baseId = React.useId()
  const hourId = `${baseId}-hour`
  const minuteId = `${baseId}-minute`
  const secondId = `${baseId}-second`
  const periodId = `${baseId}-period`

  const setHours = React.useCallback(
    (nextHour: number) => {
      const nextDate = new Date(resolvedValue)
      nextDate.setHours(nextHour)
      handleValueChange(nextDate)
    },
    [resolvedValue, handleValueChange]
  )

  const setMinutes = React.useCallback(
    (nextMinute: number) => {
      const nextDate = new Date(resolvedValue)
      nextDate.setMinutes(nextMinute)
      handleValueChange(nextDate)
    },
    [resolvedValue, handleValueChange]
  )

  const setSeconds = React.useCallback(
    (nextSecond: number) => {
      const nextDate = new Date(resolvedValue)
      nextDate.setSeconds(nextSecond)
      handleValueChange(nextDate)
    },
    [resolvedValue, handleValueChange]
  )

  const handleHourChange = React.useCallback(
    (value: string) => {
      const numericHour = Number.parseInt(value, 10)
      if (Number.isNaN(numericHour)) return

      if (hourCycle === 12) {
        let nextHour = numericHour % 12
        if (period === "pm" && nextHour !== 12) {
          nextHour += 12
        }

        if (period === "am" && nextHour === 12) {
          nextHour = 0
        }

        setHours(nextHour)
        return
      }

      setHours(numericHour)
    },
    [hourCycle, period, setHours]
  )

  const handleMinuteChange = React.useCallback(
    (value: string) => {
      const numericMinute = Number.parseInt(value, 10)
      if (Number.isNaN(numericMinute)) return
      setMinutes(numericMinute)
    },
    [setMinutes]
  )

  const handleSecondChange = React.useCallback(
    (value: string) => {
      const numericSecond = Number.parseInt(value, 10)
      if (Number.isNaN(numericSecond)) return
      setSeconds(numericSecond)
    },
    [setSeconds]
  )

  const handlePeriodChange = React.useCallback(
    (nextPeriod: Period) => {
      let nextHour = hour24

      if (nextPeriod === "am" && nextHour >= 12) {
        nextHour -= 12
      }

      if (nextPeriod === "pm" && nextHour < 12) {
        nextHour += 12
      }

      setHours(nextHour)
    },
    [hour24, setHours]
  )

  return (
    <div
      data-slot="time-picker"
      className={cn("flex items-end gap-3", className)}
      {...props}
    >
      <TimePickerSection
        id={hourId}
        label="Hour"
        hideLabel={hideLabels}
        className="w-20"
      >
        <Select
          value={hourValue}
          onValueChange={handleHourChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={hourId}
            size="sm"
            className="justify-between"
            aria-label="Select hour"
          >
            <SelectValue placeholder="--" />
          </SelectTrigger>
          <SelectContent align="start">
            {hourOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TimePickerSection>

      {showMinutes ? (
        <>
          <TimeSeparator />
          <TimePickerSection
            id={minuteId}
            label="Minute"
            hideLabel={hideLabels}
            className="w-20"
          >
            <Select
              value={minuteValue}
              onValueChange={handleMinuteChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={minuteId}
                size="sm"
                className="justify-between"
                aria-label="Select minute"
              >
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent align="start">
                {minuteOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TimePickerSection>
        </>
      ) : null}

      {showSeconds ? (
        <>
          <TimeSeparator />
          <TimePickerSection
            id={secondId}
            label="Second"
            hideLabel={hideLabels}
            className="w-20"
          >
            <Select
              value={secondValue}
              onValueChange={handleSecondChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={secondId}
                size="sm"
                className="justify-between"
                aria-label="Select second"
              >
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent align="start">
                {secondOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TimePickerSection>
        </>
      ) : null}

      {hourCycle === 12 ? (
        <>
          <TimeSeparator aria-hidden />
          <TimePickerSection
            id={periodId}
            label="Period"
            hideLabel={hideLabels}
            className="w-24"
          >
            <Select
              value={period}
              onValueChange={handlePeriodChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={periodId}
                size="sm"
                className="justify-between"
                aria-label="Select period"
              >
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="am">AM</SelectItem>
                <SelectItem value="pm">PM</SelectItem>
              </SelectContent>
            </Select>
          </TimePickerSection>
        </>
      ) : null}
    </div>
  )
}

function TimePickerSection({
  id,
  label,
  hideLabel,
  className,
  children,
}: {
  id: string
  label: string
  hideLabel?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="time-picker-section"
      className={cn("flex flex-col gap-1", className)}
    >
      {hideLabel ? null : (
        <Label
          data-slot="time-picker-label"
          htmlFor={id}
          className="text-xs font-medium"
        >
          {label}
        </Label>
      )}
      <div data-slot="time-picker-control">{children}</div>
    </div>
  )
}

function TimeSeparator(props: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="time-picker-separator"
      aria-hidden="true"
      className="text-muted-foreground pb-2 text-xl"
      {...props}
    >
      :
    </span>
  )
}

export { TimePicker }
export type { TimePickerGranularity, TimePickerProps }
