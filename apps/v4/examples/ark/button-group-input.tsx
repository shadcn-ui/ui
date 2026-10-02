import { Button } from "@/styles/ark-nova/ui/button"
import { ButtonGroup } from "@/styles/ark-nova/ui/button-group"
import { Input } from "@/styles/ark-nova/ui/input"
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
