import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Field } from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import { Label } from "@/registry/bases/radix/ui/label"
import { Textarea } from "@/registry/bases/radix/ui/textarea"
import Frame from "@/app/(design)/design/components/frame"

export default function LabelExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <LabelWithInput />
        <LabelDisabled />
        <LabelWithCheckbox />
        <LabelWithTextarea />
      </div>
    </div>
  )
}

function LabelWithCheckbox() {
  return (
    <Frame title="With Checkbox">
      <div className="flex items-center gap-3">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
      </div>
    </Frame>
  )
}

function LabelWithInput() {
  return (
    <Frame title="With Input">
      <Field>
        <Label htmlFor="label-demo-username">Username</Label>
        <Input id="label-demo-username" placeholder="Username" />
      </Field>
    </Frame>
  )
}

function LabelDisabled() {
  return (
    <Frame title="Disabled">
      <Field data-disabled={true}>
        <Label htmlFor="label-demo-disabled">Disabled</Label>
        <Input id="label-demo-disabled" placeholder="Disabled" disabled />
      </Field>
    </Frame>
  )
}

function LabelWithTextarea() {
  return (
    <Frame title="With Textarea">
      <Field>
        <Label htmlFor="label-demo-message">Message</Label>
        <Textarea id="label-demo-message" placeholder="Message" />
      </Field>
    </Frame>
  )
}
