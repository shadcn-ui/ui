import { Button } from "@/styles/radix-nova/ui/button"
import { Field } from "@/styles/radix-nova/ui/field"
import { Input } from "@/styles/radix-nova/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
