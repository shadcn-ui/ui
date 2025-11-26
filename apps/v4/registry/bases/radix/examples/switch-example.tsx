import { CanvaFrame } from "@/components/canva"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/registry/bases/radix/ui/field"
import { Label } from "@/registry/bases/radix/ui/label"
import { Switch } from "@/registry/bases/radix/ui/switch"

export default function SwitchExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SwitchBasic />
        <SwitchWithDescription />
        <SwitchDisabled />
      </div>
    </div>
  )
}

function SwitchBasic() {
  return (
    <CanvaFrame title="Basic">
      <Field orientation="horizontal">
        <Switch id="switch-basic" />
        <FieldLabel htmlFor="switch-basic">Airplane Mode</FieldLabel>
      </Field>
    </CanvaFrame>
  )
}

function SwitchWithLabel() {
  return (
    <CanvaFrame title="With Label">
      <div className="flex items-center gap-2">
        <Switch id="switch-bluetooth" defaultChecked />
        <Label htmlFor="switch-bluetooth">Bluetooth</Label>
      </div>
    </CanvaFrame>
  )
}

function SwitchWithDescription() {
  return (
    <CanvaFrame title="With Description">
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
    </CanvaFrame>
  )
}

function SwitchDisabled() {
  return (
    <CanvaFrame title="Disabled">
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled-unchecked" disabled />
          <Label htmlFor="switch-disabled-unchecked">
            Disabled (Unchecked)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled-checked" defaultChecked disabled />
          <Label htmlFor="switch-disabled-checked">Disabled (Checked)</Label>
        </div>
      </div>
    </CanvaFrame>
  )
}
