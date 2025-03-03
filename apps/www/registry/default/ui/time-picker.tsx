"use client"

import React, {
  HTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { cn } from "@/lib/utils"
import { Slider } from "@/registry/default/ui/slider"

const TimePickerContext = createContext({
  time: 0,
  timeReducer: (value: number) => {},
})
type TimePickerContainerProps = {
  children?: React.ReactNode
  onTimeChange?: (value: number) => void
}
const TimePickerContainer: React.FC<TimePickerContainerProps> = (props) => {
  const [time, setTime] = useState(0)
  return (
    <TimePickerContext.Provider
      value={{
        time: time,
        timeReducer: (value) => {
          setTime((prev) => prev + value)
        },
      }}
    >
      <TimePickerTrigger {...props} />
    </TimePickerContext.Provider>
  )
}
const TimePickerTrigger = (props: TimePickerContainerProps) => {
  const timePickerContext = useContext(TimePickerContext)
  useEffect(() => {
    props.onTimeChange?.(timePickerContext.time)
  }, [props, timePickerContext])

  return <>{props.children}</>
}
type TimePickerProps = {
  timeMilliseconds: number
  step: number
  maxValue: number
  minValue: number
  prefixLabel?: ((value: number) => React.ReactNode) | React.ReactNode
  suffixLabel?: ((value: number) => React.ReactNode) | React.ReactNode

  value: number
  onValueChange?: (value: number) => void
} & HTMLAttributes<HTMLDivElement>
const TimePicker = ({
  timeMilliseconds = 1,
  step = 1,
  maxValue = 1000,
  minValue = 0,
  value = 0,
  onValueChange,
  ...props
}: TimePickerProps) => {
  const timePickerContext = useContext(TimePickerContext)
  const [timeValue, setTimeValue] = useState(value - minValue)
  useEffect(() => {
    setTimeValue(value - minValue)
  }, [value])
  useEffect(() => {
    onValueChange?.(timeValue + minValue)
    timePickerContext.timeReducer((timeValue + minValue) * timeMilliseconds)
    return () => {
      timePickerContext.timeReducer(-(timeValue + minValue) * timeMilliseconds)
    }
  }, [timeValue])
  const prefix =
    typeof props.prefixLabel === "function"
      ? props.prefixLabel(timeValue + minValue)
      : props.prefixLabel
  const suffix =
    typeof props.suffixLabel === "function"
      ? props.suffixLabel(timeValue + minValue)
      : props.suffixLabel
  return (
    <div
      {...props}
      className={cn(
        "flex flex-row gap-2 items-center justify-around",
        props.className
      )}
    >
      {prefix}
      <Slider
        defaultValue={[timeValue]}
        max={maxValue - minValue}
        step={step}
        className={cn("")}
        onValueChange={(v) => {
          setTimeValue(v[0])
        }}
      />
      {suffix}
    </div>
  )
}

export { TimePicker, TimePickerContainer }
