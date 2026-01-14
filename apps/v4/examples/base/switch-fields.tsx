import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Switch } from "@/examples/base/ui/switch"

export function SwitchFields() {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="switch-airplane">Airplane Mode</FieldLabel>
          <FieldDescription>
            Turn on airplane mode to disable all connections.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-airplane" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="switch-dark">Dark Mode</FieldLabel>
        <Switch id="switch-dark" />
      </Field>
      <Field orientation="horizontal">
        <Switch id="switch-marketing" />
        <FieldContent>
          <FieldLabel htmlFor="switch-marketing">Marketing Emails</FieldLabel>
          <FieldDescription>
            Receive emails about new products, features, and more.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Privacy Settings</FieldLabel>
        <FieldDescription>Manage your privacy preferences.</FieldDescription>
        <Field orientation="horizontal">
          <Switch id="switch-profile" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="switch-profile" className="font-normal">
              Make profile visible to others
            </FieldLabel>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <Switch id="switch-email" />
          <FieldContent>
            <FieldLabel htmlFor="switch-email" className="font-normal">
              Show email on profile
            </FieldLabel>
          </FieldContent>
        </Field>
      </Field>
      <Field data-invalid orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="switch-invalid">Invalid Switch</FieldLabel>
          <FieldDescription>
            This switch has validation errors.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-invalid" aria-invalid />
      </Field>
      <Field data-disabled orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="switch-disabled-field">
            Disabled Switch
          </FieldLabel>
          <FieldDescription>
            This switch is currently disabled.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-disabled-field" disabled />
      </Field>
    </FieldGroup>
  )
}
