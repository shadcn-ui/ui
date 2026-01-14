import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { Progress } from "@/examples/radix/ui/progress"

export function ProgressWithLabel() {
  return (
    <Field>
      <FieldLabel htmlFor="progress-upload">
        <span>Upload progress</span>
        <span className="ml-auto">66%</span>
      </FieldLabel>
      <Progress value={66} className="w-full" id="progress-upload" />
    </Field>
  )
}
