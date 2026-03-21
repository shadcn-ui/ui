import { Badge } from "@/examples/react-aria/ui/badge"
import { Field, FieldLabel } from "@/examples/react-aria/ui/field"
import { Input } from "@/examples/react-aria/ui/input"

export function InputBadge() {
  return (
    <Field>
      <FieldLabel htmlFor="input-badge">
        Webhook URL{" "}
        <Badge variant="secondary" className="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input
        id="input-badge"
        type="url"
        placeholder="https://api.example.com/webhook"
      />
    </Field>
  )
}
