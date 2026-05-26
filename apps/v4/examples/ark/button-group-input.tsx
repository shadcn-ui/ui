import { Button } from "@/examples/ark/ui/button"
import { ButtonGroup } from "@/examples/ark/ui/button-group"
import { Input } from "@/examples/ark/ui/input"
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
