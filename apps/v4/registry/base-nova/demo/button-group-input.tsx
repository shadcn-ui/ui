import { SearchIcon } from "lucide-react"

import { Button } from "@/registry/base-nova/ui/button"
import { ButtonGroup } from "@/registry/base-nova/ui/button-group"
import { Input } from "@/registry/base-nova/ui/input"

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
