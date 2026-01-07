import { Button } from "@/registry/radix-nova/ui/button"
import { Spinner } from "@/registry/radix-nova/ui/spinner"

export function SpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner />
        Loading...
      </Button>
      <Button variant="outline" disabled size="sm">
        <Spinner />
        Please wait
      </Button>
      <Button variant="secondary" disabled size="sm">
        <Spinner />
        Processing
      </Button>
    </div>
  )
}
