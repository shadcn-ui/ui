"use client"

import { useState } from "react"

import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/default/ui/time-picker"

export default function TimePickerWithValue() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  return (
    <div className={"w-full h-full flex flex-col items-center gap-6"}>
      <TimePickerContainer onTimeChange={setTotalTime}>
        <TimePicker
          value={hours}
          onValueChange={setHours}
          timeMilliseconds={1000 * 60 * 60}
          maxValue={24}
          prefixLabel={
            <span className={"text-sm w-24 text-center"}>Hours</span>
          }
        />
        <TimePicker
          value={minutes}
          onValueChange={setMinutes}
          timeMilliseconds={1000 * 60}
          maxValue={60}
          prefixLabel={
            <span className={"text-sm w-24 text-center"}>Minutes</span>
          }
        />
        <TimePicker
          value={seconds}
          onValueChange={setSeconds}
          timeMilliseconds={1000}
          maxValue={60}
          prefixLabel={
            <span className={"text-sm w-24 text-center"}>Seconds</span>
          }
        />
      </TimePickerContainer>
      <span>Total Time : {totalTime} ms</span>
    </div>
  )
}
