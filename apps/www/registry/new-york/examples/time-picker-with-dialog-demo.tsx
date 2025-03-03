"use client"

import { TimerIcon } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/new-york/ui/time-picker"

export default function TimePickerWithDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={"w-1/2 flex flex-row items-center"}>
          <TimerIcon />
          Select Time Period
        </Button>
      </DialogTrigger>
      <DialogContent
        className={"w-[90vw] h-[45vh] flex flex-col items-center "}
      >
        <DialogHeader>Time Selector</DialogHeader>
        <div className={"h-1/6"} />
        <TimePickerContainer>
          <TimePicker
            className={"w-5/6"}
            timeMilliseconds={1000}
            minValue={0}
            maxValue={60}
            prefixLabel={
              <span className={"w-24 text-sm text-center"}>Seconds</span>
            }
            suffixLabel={(value) => (
              <span className={"w-16 text-sm text-center"}>{value}s</span>
            )}
            value={2}
            step={1}
          />
          <TimePicker
            className={"w-5/6"}
            timeMilliseconds={1000 * 60}
            minValue={0}
            maxValue={60}
            prefixLabel={
              <span className={"w-24 text-sm text-center"}>Minutes</span>
            }
            suffixLabel={(value) => (
              <span className={"w-16 text-sm text-center"}>{value}min</span>
            )}
            value={2}
            step={1}
          />
          <TimePicker
            className={"w-5/6"}
            timeMilliseconds={1000 * 60 * 60}
            minValue={0}
            maxValue={1000}
            prefixLabel={
              <span className={"w-24 text-sm text-center"}>Hours</span>
            }
            suffixLabel={(value) => (
              <span className={"w-16 text-sm text-center"}>{value}h</span>
            )}
            value={2}
            step={1}
          />
        </TimePickerContainer>
        <div className={"h-1/6"} />
        <DialogClose>
          <Button>Submit</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
