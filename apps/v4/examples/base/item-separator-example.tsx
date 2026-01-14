import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/examples/base/ui/item"
import { InboxIcon } from "lucide-react"

export function ItemSeparatorExample() {
  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Inbox</ItemTitle>
          <ItemDescription>View all incoming messages.</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sent</ItemTitle>
          <ItemDescription>View all sent messages.</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Drafts</ItemTitle>
          <ItemDescription>View all draft messages.</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Archive</ItemTitle>
          <ItemDescription>View archived messages.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
