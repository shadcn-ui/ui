import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
} from "@/examples/ark/ui/radio-group"
import {
  FieldContent,
  FieldDescription,
} from "@/examples/ark/ui/field"

export function RadioGroupChoiceCard() {
  return (
    <RadioGroup defaultValue="plus" className="max-w-sm">
      <RadioGroupItem value="plus">
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText>Plus</RadioGroupItemText>
          <FieldDescription>
            For individuals and small teams.
          </FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="pro">
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText>Pro</RadioGroupItemText>
          <FieldDescription>For growing businesses.</FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="enterprise">
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText>Enterprise</RadioGroupItemText>
          <FieldDescription>
            For large teams and enterprises.
          </FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
