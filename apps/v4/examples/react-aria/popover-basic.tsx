import { Button } from "@/styles/react-aria-nova/ui/button"
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/styles/react-aria-nova/ui/popover"

export function PopoverBasic() {
  return (
    <PopoverTrigger>
      <Button variant="outline">Open Popover</Button>
      <Popover align="start">
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
