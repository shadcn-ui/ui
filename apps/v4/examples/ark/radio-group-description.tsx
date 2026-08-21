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

export function RadioGroupDescription() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <RadioGroupItem value="default">
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText>Default</RadioGroupItemText>
          <FieldDescription>
            Standard spacing for most use cases.
          </FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="comfortable">
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText>Comfortable</RadioGroupItemText>
          <FieldDescription>More space between elements.</FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="compact">
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText>Compact</RadioGroupItemText>
          <FieldDescription>
            Minimal spacing for dense layouts.
          </FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
