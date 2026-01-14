import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/examples/base/ui/item"

export function ItemHeaderExamples() {
  return (
    <>
      <Item>
        <ItemHeader>
          <span className="text-sm font-medium">Design System</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Component Library</ItemTitle>
          <ItemDescription>
            A comprehensive collection of reusable UI components for building
            consistent interfaces.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <span className="text-sm font-medium">Marketing</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Campaign Analytics</ItemTitle>
          <ItemDescription>
            Track performance metrics and engagement rates across all marketing
            channels.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <span className="text-sm font-medium">Engineering</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>API Documentation</ItemTitle>
          <ItemDescription>
            Complete reference guide for all available endpoints and
            authentication methods.
          </ItemDescription>
        </ItemContent>
      </Item>
    </>
  )
}
