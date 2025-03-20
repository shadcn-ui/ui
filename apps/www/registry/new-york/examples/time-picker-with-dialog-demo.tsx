"use client"

import { useState } from "react"
import { Description } from "@radix-ui/react-dialog"
import { TimerIcon } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/new-york/ui/time-picker"

export default function TimePickerWithDialogDemo() {
  const [time, setTime] = useState(0)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={"min-w-fit flex flex-row items-center"}>
          <TimerIcon />
          Select Time Period
        </Button>
      </DialogTrigger>
      <DialogContent className={"w-96 h-80 flex flex-col items-center gap-4"}>
        <DialogHeader>
          <DialogTitle className={"font-semibold text-xl mt-1"}>
            Time Selector
          </DialogTitle>
        </DialogHeader>
        <Description>Please select the time period you like.</Description>
        <TimePickerContainer onTimeChange={setTime}>
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
            value={0}
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
            value={0}
            step={1}
          />
          <TimePicker
            className={"w-5/6"}
            timeMilliseconds={1000 * 60 * 60}
            maxValue={24}
            prefixLabel={
              <span className={"w-24 text-sm text-center"}>Hours</span>
            }
            suffixLabel={(value) => (
              <span className={"w-16 text-sm text-center"}>{value}h</span>
            )}
            value={0}
            step={1}
          />
        </TimePickerContainer>
        <span>Total time : {time} ms</span>
        <DialogClose
          className={"bg-foreground rounded-md text-background px-4 py-2"}
        >
          Submit
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
