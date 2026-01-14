import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/examples/base/ui/progress"

export function ProgressWithLabel() {
  return (
    <Progress value={56}>
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
