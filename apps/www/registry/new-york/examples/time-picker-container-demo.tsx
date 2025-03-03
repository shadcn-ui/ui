import {
  TimePicker,
  TimePickerContainer,
} from "@/registry/default/ui/time-picker"

export default function TimePickerContainerDemo() {
  return (
    <div className={"w-[10vh]"}>
      <TimePickerContainer>
        <TimePicker
          className={"w-full"}
          timeMilliseconds={1}
          step={1}
          maxValue={0}
          minValue={100}
          prefix={<>ms</>}
          defaultValue={2}
        />
      </TimePickerContainer>
    </div>

  )
}
