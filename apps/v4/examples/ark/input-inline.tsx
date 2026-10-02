import { Button } from "@/styles/ark-nova/ui/button"
import { Field } from "@/styles/ark-nova/ui/field"
import { Input } from "@/styles/ark-nova/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
