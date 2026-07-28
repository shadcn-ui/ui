import { Field, FieldDescription, FieldLabel } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"

export function InputFile() {
  return (
    <Field>
      <FieldLabel htmlFor="picture">Picture</FieldLabel>
      <Input id="picture" type="file" />
      <FieldDescription>Select a picture to upload.</FieldDescription>
    </Field>
  )
}
