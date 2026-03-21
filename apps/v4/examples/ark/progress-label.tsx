import { Field, FieldLabel } from "@/examples/ark/ui/field"
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/examples/ark/ui/progress"

export function ProgressWithLabel() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>Upload progress</span>
        <span className="ml-auto">66%</span>
      </FieldLabel>
      <Progress value={66} id="progress-upload">
        <ProgressTrack>
          <ProgressRange />
        </ProgressTrack>
      </Progress>
    </Field>
  )
}
