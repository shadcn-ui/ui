import { Loader2 } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

export default function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 size-4 animate-spin" />
      Please wait
    </Button>
  )
}
