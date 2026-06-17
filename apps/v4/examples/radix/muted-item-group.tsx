import { Button } from "@/styles/radix-force-ui/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/styles/radix-force-ui/ui/item"

export function MutedItemGroup() {
  return (
    <ItemGroup>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Item 1</ItemTitle>
          <ItemDescription>First item in muted group.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Item 2</ItemTitle>
          <ItemDescription>Second item in muted group.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Item 3</ItemTitle>
          <ItemDescription>Third item in muted group.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
