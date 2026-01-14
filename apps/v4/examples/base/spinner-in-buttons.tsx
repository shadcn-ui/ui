import { Button } from "@/examples/base/ui/button"
import { Spinner } from "@/examples/base/ui/spinner"

export function SpinnerInButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button>
        <Spinner data-icon="inline-start" /> Submit
      </Button>
      <Button disabled>
        <Spinner data-icon="inline-start" /> Disabled
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" /> Outline
      </Button>
      <Button variant="outline" size="icon" disabled>
        <Spinner data-icon="inline-start" />
        <span className="sr-only">Loading...</span>
      </Button>
    </div>
  )
}
