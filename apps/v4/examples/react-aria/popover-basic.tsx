import { Button } from "@/examples/react-aria/ui/button"
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/react-aria/ui/popover"

export function PopoverBasic() {
  return (
    <>
      <PopoverTrigger>
        <Button variant="outline" className="w-fit">
          Open Popover
        </Button>
        <Popover align="start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
        </Popover>
      </PopoverTrigger>
    </>
  )
}
