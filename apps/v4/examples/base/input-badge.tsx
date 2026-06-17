import { Badge } from "@/styles/base-force-ui/ui/badge"
import { Field, FieldLabel } from "@/styles/base-force-ui/ui/field"
import { Input } from "@/styles/base-force-ui/ui/input"

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
