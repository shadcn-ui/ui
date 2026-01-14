import { Button } from "@/examples/radix/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/examples/radix/ui/item"
import { InboxIcon } from "lucide-react"

export function ItemMutedSmall() {
  return (
    <>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
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
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
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
