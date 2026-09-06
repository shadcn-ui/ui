import { Button } from "@/styles/aria-nova/ui/button"
import { Field } from "@/styles/aria-nova/ui/field"
import { Input } from "@/styles/aria-nova/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
