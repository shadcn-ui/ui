import { Button } from "@/examples/base/ui/button"
import { Field } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
