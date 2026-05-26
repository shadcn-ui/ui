import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
} from "@/examples/ark/ui/radio-group"

export function RadioGroupInvalid() {
  return (
    <RadioGroup defaultValue="email" className="w-full max-w-xs">
      <RadioGroupLabel>Notification Preferences</RadioGroupLabel>
      <RadioGroupItem value="email">
        <RadioGroupItemControl />
        <RadioGroupItemText className="font-normal">
          Email only
        </RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="sms">
        <RadioGroupItemControl />
        <RadioGroupItemText className="font-normal">
          SMS only
        </RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="both">
        <RadioGroupItemControl />
        <RadioGroupItemText className="font-normal">
          Both Email & SMS
        </RadioGroupItemText>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
