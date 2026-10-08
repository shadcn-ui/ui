import { SearchIcon } from "lucide-react"

import { Button } from "@/styles/radix-nova/ui/button"
import { ButtonGroup } from "@/styles/radix-nova/ui/button-group"
import { Input } from "@/styles/radix-nova/ui/input"

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
