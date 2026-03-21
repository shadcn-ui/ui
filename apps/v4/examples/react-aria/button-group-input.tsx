import { Button } from "@/examples/react-aria/ui/button"
import { ButtonGroup } from "@/examples/react-aria/ui/button-group"
import { Input } from "@/examples/react-aria/ui/input"
import { SearchIcon } from "lucide-react"

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
