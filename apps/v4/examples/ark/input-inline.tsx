import { Button } from "@/examples/ark/ui/button"
import { Field } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
