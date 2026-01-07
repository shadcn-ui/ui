import { Button } from "@/registry/bases/radix/ui/button"
import { Spinner } from "@/registry/bases/radix/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
