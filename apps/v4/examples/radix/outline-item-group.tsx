import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/examples/radix/ui/item"
import { InboxIcon } from "lucide-react"

export function OutlineItemGroup() {
  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Item 1</ItemTitle>
          <ItemDescription>First item with icon.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Item 2</ItemTitle>
          <ItemDescription>Second item with icon.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Item 3</ItemTitle>
          <ItemDescription>Third item with icon.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
