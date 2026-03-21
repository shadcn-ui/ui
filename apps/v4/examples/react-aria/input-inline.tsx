import { Button } from "@/examples/react-aria/ui/button"
import { Field } from "@/examples/react-aria/ui/field"
import { Input } from "@/examples/react-aria/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
