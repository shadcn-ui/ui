"use client"

import { TimerIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/registry/default/ui/dialog"
import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/default/ui/time-picker"

export default function TimePickerWithDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={"w-1/2 flex flex-row items-center"}>
          <TimerIcon />
          Select Time Period
        </Button>
      </DialogTrigger>
      <DialogContent className={"w-[70vw] h-[45vh]"}>
        <DialogHeader>Time Selector</DialogHeader>
        <TimePickerContainer>
          <TimePicker
            className={"w-full"}
            timeMilliseconds={1}
            minValue={0}
            maxValue={1000}
            prefixLabel={
              <span className={"w-[15vw] text-center"}>Milliseconds</span>
            }
            suffixLabel={(value) => (
              <span className={"w-[15vw] text-center"}>{value}ms</span>
            )}
            value={2}
            step={1}
          />
          <TimePicker
            className={"w-full"}
            timeMilliseconds={1000}
            minValue={0}
            maxValue={60}
            prefixLabel={
              <span className={"w-[15vw] text-center"}>Seconds</span>
            }
            suffixLabel={(value) => (
              <span className={"w-[15vw] text-center"}>{value}s</span>
            )}
            value={2}
            step={1}
          />
          <TimePicker
            className={"w-full"}
            timeMilliseconds={1000 * 60}
            minValue={0}
            maxValue={60}
            prefixLabel={
              <span className={"w-[15vw] text-center"}>Minutes</span>
            }
            suffixLabel={(value) => (
              <span className={"w-[15vw] text-center"}>{value}min</span>
            )}
            value={2}
            step={1}
          />
        </TimePickerContainer>
        <DialogClose>
          <Button>Submit</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
