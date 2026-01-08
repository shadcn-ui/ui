import { Button } from "@/examples/radix/ui/button"
import { Spinner } from "@/examples/radix/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
