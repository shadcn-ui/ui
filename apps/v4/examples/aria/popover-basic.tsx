import { Button } from "@/styles/aria-nova/ui/button"
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/styles/aria-nova/ui/popover"

export function PopoverBasic() {
  return (
    <PopoverTrigger>
      <Button variant="outline">Open Popover</Button>
      <Popover placement="bottom start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
      </Popover>
    </PopoverTrigger>
  )
}
