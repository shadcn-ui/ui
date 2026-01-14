import { Button } from "@/examples/radix/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/examples/radix/ui/item"
import { InboxIcon } from "lucide-react"

export function ItemDefaultExtraSmall() {
  return (
    <>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </>
  )
}
