import { Button } from "@/examples/radix/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function ButtonExamples() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>
          Submit <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="destructive">Delete</Button>
        <Button size="icon">
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
