import { SearchIcon } from "lucide-react"

import { Button } from "@/styles/radix-force-ui/ui/button"
import { ButtonGroup } from "@/styles/radix-force-ui/ui/button-group"
import { Input } from "@/styles/radix-force-ui/ui/input"

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
