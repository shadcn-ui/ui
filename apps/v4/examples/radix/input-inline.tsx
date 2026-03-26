import { Button } from "@/examples/radix/ui/button"
import { Field } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
