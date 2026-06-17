import { Button } from "@/styles/radix-force-ui/ui/button"
import { Field } from "@/styles/radix-force-ui/ui/field"
import { Input } from "@/styles/radix-force-ui/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
