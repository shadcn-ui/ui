import { Field, FieldLabel } from "@/examples/ark/ui/field"
import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

export default function FieldSwitch() {
  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
      <Switch id="2fa">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </Switch>
    </Field>
  )
}
