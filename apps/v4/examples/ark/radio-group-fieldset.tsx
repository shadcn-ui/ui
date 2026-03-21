import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
} from "@/examples/ark/ui/radio-group"

export function RadioGroupFieldset() {
  return (
    <RadioGroup defaultValue="monthly" className="w-full max-w-xs">
      <RadioGroupLabel>Subscription Plan</RadioGroupLabel>
      <RadioGroupItem value="monthly">
        <RadioGroupItemControl />
        <RadioGroupItemText className="font-normal">
          Monthly ($9.99/month)
        </RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="yearly">
        <RadioGroupItemControl />
        <RadioGroupItemText className="font-normal">
          Yearly ($99.99/year)
        </RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="lifetime">
        <RadioGroupItemControl />
        <RadioGroupItemText className="font-normal">
          Lifetime ($299.99)
        </RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
