import {
  Example,
  ExampleWrapper,
} from "@/registry/radix-maia/components/example"
import { Checkbox } from "@/registry/radix-maia/ui/checkbox"
import { Field } from "@/registry/radix-maia/ui/field"
import { Input } from "@/registry/radix-maia/ui/input"
import { Label } from "@/registry/radix-maia/ui/label"
import { Textarea } from "@/registry/radix-maia/ui/textarea"

export default function LabelExample() {
  return (
    <ExampleWrapper>
      <LabelWithCheckbox />
      <LabelWithInput />
      <LabelDisabled />
      <LabelWithTextarea />
    </ExampleWrapper>
  )
}

function LabelWithCheckbox() {
  return (
    <Example title="With Checkbox">
      <Field orientation="horizontal">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
      </Field>
    </Example>
  )
}

function LabelWithInput() {
  return (
    <Example title="With Input">
      <Field>
        <Label htmlFor="label-demo-username">Username</Label>
        <Input id="label-demo-username" placeholder="Username" />
      </Field>
    </Example>
  )
}

function LabelDisabled() {
  return (
    <Example title="Disabled">
      <Field data-disabled={true}>
        <Label htmlFor="label-demo-disabled">Disabled</Label>
        <Input id="label-demo-disabled" placeholder="Disabled" disabled />
      </Field>
    </Example>
  )
}

function LabelWithTextarea() {
  return (
    <Example title="With Textarea">
      <Field>
        <Label htmlFor="label-demo-message">Message</Label>
        <Textarea id="label-demo-message" placeholder="Message" />
      </Field>
    </Example>
  )
}
