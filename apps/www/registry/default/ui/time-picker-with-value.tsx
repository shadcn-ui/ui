import { useState } from "react"

import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/new-york/ui/time-picker"

export default function TimePickerWithValue() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  return (
    <div className={"w-full h-full flex flex-col items-center gap-2"}>
      <TimePickerContainer onTimeChange={setTotalTime}>
        <TimePicker
          value={hours}
          onValueChange={setHours}
          timeMilliseconds={1000 * 60 * 60}
          maxValue={24}
        />
        <TimePicker
          value={minutes}
          onValueChange={setMinutes}
          timeMilliseconds={1000 * 60}
          maxValue={60}
        />
        <TimePicker
          value={seconds}
          onValueChange={setSeconds}
          timeMilliseconds={1000}
          maxValue={60}
        />
      </TimePickerContainer>
      <span>Total Time : {totalTime} ms</span>
    </div>
  )
}
