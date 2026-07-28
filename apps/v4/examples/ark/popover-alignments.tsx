import { Button } from "@/examples/ark/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/ark/ui/popover"

export function PopoverAlignments() {
  return (
    <div className="flex gap-6">
      <Popover positioning={{ placement: "bottom-start" }}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Start
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          Aligned to start
        </PopoverContent>
      </Popover>
      <Popover positioning={{ placement: "bottom" }}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Center
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          Aligned to center
        </PopoverContent>
      </Popover>
      <Popover positioning={{ placement: "bottom-end" }}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            End
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          Aligned to end
        </PopoverContent>
      </Popover>
    </div>
  )
}
