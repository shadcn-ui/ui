import { Loader2 } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

export default function ButtonLoading() {
  return (
    <div className="cursor-progress">
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin " />
        Please wait
      </Button>
    </div>
  )
}
