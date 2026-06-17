import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/styles/radix-force-ui/ui/field"
import { Switch } from "@/styles/radix-force-ui/ui/switch"

export function SwitchDescription() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="switch-focus-mode">
          Share across devices
        </FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-focus-mode" />
    </Field>
  )
}
