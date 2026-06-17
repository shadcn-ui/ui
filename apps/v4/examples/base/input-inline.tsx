import { Button } from "@/styles/base-force-ui/ui/button"
import { Field } from "@/styles/base-force-ui/ui/field"
import { Input } from "@/styles/base-force-ui/ui/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
