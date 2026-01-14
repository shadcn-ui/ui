import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import {
  CopyIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateCwIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react"

export function ButtonGroupVerticalNested() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Design tools palette">
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon">
          <SearchIcon />
        </Button>
        <Button variant="outline" size="icon">
          <CopyIcon />
        </Button>
        <Button variant="outline" size="icon">
          <ShareIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon">
          <FlipHorizontalIcon />
        </Button>
        <Button variant="outline" size="icon">
          <FlipVerticalIcon />
        </Button>
        <Button variant="outline" size="icon">
          <RotateCwIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <TrashIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
