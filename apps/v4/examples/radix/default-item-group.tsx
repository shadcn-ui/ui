import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/examples/radix/ui/item"

export function DefaultItemGroup() {
  return (
    <ItemGroup>
      <Item>
        <ItemContent>
          <ItemTitle>Item 1</ItemTitle>
          <ItemDescription>First item in the group.</ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Item 2</ItemTitle>
          <ItemDescription>Second item in the group.</ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Item 3</ItemTitle>
          <ItemDescription>Third item in the group.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
