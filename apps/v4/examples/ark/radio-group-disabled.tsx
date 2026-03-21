import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
} from "@/examples/ark/ui/radio-group"

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option2" className="w-fit">
      <RadioGroupItem value="option1" disabled>
        <RadioGroupItemControl />
        <RadioGroupItemText>Disabled</RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="option2">
        <RadioGroupItemControl />
        <RadioGroupItemText>Option 2</RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="option3">
        <RadioGroupItemControl />
        <RadioGroupItemText>Option 3</RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
