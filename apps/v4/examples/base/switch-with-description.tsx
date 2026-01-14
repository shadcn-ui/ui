import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/examples/base/ui/field"
import { Switch } from "@/examples/base/ui/switch"

export function SwitchWithDescription() {
  return (
    <FieldLabel htmlFor="switch-focus-mode">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Share across devices</FieldTitle>
          <FieldDescription>
            Focus is shared across devices, and turns off when you leave the
            app.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-focus-mode" />
      </Field>
    </FieldLabel>
  )
}
