import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/radix-force-ui/ui/field"
import { Input } from "@/styles/radix-force-ui/ui/input"

export function InputDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-api-key">API Key</FieldLabel>
      <Input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <FieldDescription>
        Your API key is encrypted and stored securely.
      </FieldDescription>
    </Field>
  )
}
