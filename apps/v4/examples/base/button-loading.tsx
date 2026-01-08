import { Button } from "@/examples/base/ui/button"
import { Spinner } from "@/examples/base/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
