import { Button } from "@/registry/base-nova/ui/button"
import { Spinner } from "@/registry/base-nova/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
