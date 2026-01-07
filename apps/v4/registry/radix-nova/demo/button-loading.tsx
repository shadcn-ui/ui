import { Button } from "@/registry/radix-nova/ui/button"
import { Spinner } from "@/registry/radix-nova/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
