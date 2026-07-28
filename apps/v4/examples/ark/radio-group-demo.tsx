import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
} from "@/examples/ark/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <RadioGroupItem value="default">
        <RadioGroupItemControl />
        <RadioGroupItemText>Default</RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="comfortable">
        <RadioGroupItemControl />
        <RadioGroupItemText>Comfortable</RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="compact">
        <RadioGroupItemControl />
        <RadioGroupItemText>Compact</RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
