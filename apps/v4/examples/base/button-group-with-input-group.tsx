import { Input } from "@/examples/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import { SearchIcon } from "lucide-react"

export function ButtonGroupWithInputGroup() {
  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon align="inline-start" className="text-muted-foreground">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
