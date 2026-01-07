import { Button } from "@/registry/bases/base/ui/button"
import { Spinner } from "@/registry/bases/base/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
