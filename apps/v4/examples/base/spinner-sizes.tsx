import { Spinner } from "@/styles/base-force-ui/ui/spinner"

export function SpinnerSizes() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  )
}
