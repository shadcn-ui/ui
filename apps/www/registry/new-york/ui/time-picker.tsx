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
  setTime: (value: number) => {},
})
type TimePickerContainerProps = {
  children?: React.ReactNode
  onTimeChange?: (value: number) => void
}
const TimePickerContainer: React.FC<TimePickerContainerProps> = (props) => {
  const [time, setTime] = useState(0)
  return (
    <TimePickerContext.Provider value={{ time: time, setTime: timeReducer }}>
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
  label: React.ReactNode
  defaultValue: number
} & HTMLAttributes<HTMLDivElement>
const TimePicker = ({
  timeMilliseconds = 1,
  step = 1,
  maxValue = 1000,
  minValue = 0,
  defaultValue = 0,

  ...props
}: TimePickerProps) => {
  const timePickerContext = useContext(TimePickerContext)
  useEffect(() => {
    timePickerContext.setTime(
      timePickerContext.time + defaultValue * timeMilliseconds
    )
  }, [])
  return (
    <div
      {...props}
      className={cn(
        "flex flex-row items-center justify-start gap-2",
        props.className
      )}
    >
      {props.prefix}
      <Slider className={"w-full h-fit"} defaultValue={[defaultValue]} />
    </div>
  )
}

export { TimePicker, TimePickerContainer }
