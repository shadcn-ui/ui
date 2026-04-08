import { Button } from "@/styles/react-aria-nova/ui/button"
import { Field } from "@/styles/react-aria-nova/ui/field"
import { Input } from "@/styles/react-aria-nova/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
