import { SearchIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import { ButtonGroup } from "@/styles/aria-nova/ui/button-group"
import { Input } from "@/styles/aria-nova/ui/input"

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
