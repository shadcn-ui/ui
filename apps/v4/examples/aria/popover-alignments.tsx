import { Button } from "@/styles/aria-nova/ui/button"
import { Popover, PopoverTrigger } from "@/styles/aria-nova/ui/popover"

export function PopoverAlignments() {
  return (
    <>
      <div className="flex gap-6">
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            Start
          </Button>
          <Popover placement="bottom start" className="w-40">
            Aligned to start
          </Popover>
        </PopoverTrigger>
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            Center
          </Button>
          <Popover placement="bottom" className="w-40">
            Aligned to center
          </Popover>
        </PopoverTrigger>
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            End
          </Button>
          <Popover placement="bottom end" className="w-40">
            Aligned to end
          </Popover>
        </PopoverTrigger>
      </div>
    </>
  )
}
