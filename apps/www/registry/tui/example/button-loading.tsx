import { Loader2 } from "lucide-react"

import { Button } from "@/registry/tui/ui/button"

export default function ButtonLoading() {
  return (
    <Button disabled icon="loader-solid" iconStyle="animate-spin">
      
      Please wait
    </Button>
  )
}
