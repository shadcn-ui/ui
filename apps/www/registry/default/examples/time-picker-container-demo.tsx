"use client"

import { useState } from "react"

import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/default/ui/time-picker"

export default function TimePickerContainerDemo() {
  const [time, setTime] = useState(0)
  return (
    <div
      className={
        "flex w-full select-none flex-col items-center justify-center gap-2"
      }
    >
      <h1>Please set the time</h1>
      <TimePickerContainer onTimeChange={(v) => setTime(v)}>
        <TimePicker
          className={"w-full"}
          timeMilliseconds={1000 * 60 * 60 * 7}
          step={1}
          maxValue={10}
          minValue={2}
          prefixLabel={<span className={"w-20 text-center"}>Week</span>}
          suffixLabel={(value) => (
            <span className={"w-20 text-center"}>{value}w</span>
          )}
          value={3}
        />
        <TimePicker
          className={"w-full"}
          timeMilliseconds={1000 * 60 * 60 * 24}
          step={1}
          maxValue={7}
          minValue={0}
          prefixLabel={<span className={"w-20 text-center"}>Day</span>}
          suffixLabel={(value) => (
            <span className={"w-20 text-center"}>{value}d</span>
          )}
          value={3}
        />
        <TimePicker
          className={"w-full"}
          timeMilliseconds={1000 * 60 * 60}
          step={2}
          maxValue={24}
          minValue={0}
          prefixLabel={<span className={"w-20 text-center"}>Hour</span>}
          suffixLabel={(value) => (
            <span className={"w-20 text-center"}>{value}h</span>
          )}
          value={3}
        />
        <TimePicker
          className={"w-full"}
          timeMilliseconds={1000 * 60}
          step={1}
          maxValue={60}
          minValue={0}
          prefixLabel={<span className={"w-20 text-center"}>Minute</span>}
          suffixLabel={(value) => (
            <span className={"w-20 text-center"}>{value}min</span>
          )}
          value={1}
        />
      </TimePickerContainer>
      <span>Total Time:{time}</span>
    </div>
  )
}
