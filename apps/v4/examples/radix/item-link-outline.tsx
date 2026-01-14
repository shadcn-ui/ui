import { Button } from "@/examples/radix/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/examples/radix/ui/item"
import { InboxIcon } from "lucide-react"

export function ItemLinkOutline() {
  return (
    <ItemGroup>
      <Item variant="outline" asChild>
        <a href="#">
          <ItemContent>
            <ItemTitle>Title Only (Link)</ItemTitle>
          </ItemContent>
        </a>
      </Item>
      <Item variant="outline" asChild>
        <a href="#">
          <ItemContent>
            <ItemTitle>Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Clickable item with title and description.
            </ItemDescription>
          </ItemContent>
        </a>
      </Item>
      <Item variant="outline" asChild>
        <a href="#">
          <ItemMedia variant="icon">
            <InboxIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title (Link)</ItemTitle>
          </ItemContent>
        </a>
      </Item>
      <Item variant="outline" asChild>
        <a href="#">
          <ItemMedia variant="icon">
            <InboxIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Complete link item with media, title, and description.
            </ItemDescription>
          </ItemContent>
        </a>
      </Item>
      <Item variant="outline" asChild>
        <a href="#">
          <ItemContent>
            <ItemTitle>With Actions (Link)</ItemTitle>
            <ItemDescription>
              Link item that also has action buttons.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </ItemActions>
        </a>
      </Item>
    </ItemGroup>
  )
}
