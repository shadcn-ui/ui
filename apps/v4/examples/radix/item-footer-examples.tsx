import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/examples/radix/ui/item"

export function ItemFooterExamples() {
  return (
    <>
      <Item>
        <ItemContent>
          <ItemTitle>Quarterly Report Q4 2024</ItemTitle>
          <ItemDescription>
            Financial overview including revenue, expenses, and growth metrics
            for the fourth quarter.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Last updated 2 hours ago
          </span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>User Research Findings</ItemTitle>
          <ItemDescription>
            Insights from interviews and surveys conducted with 50+ users across
            different demographics.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Created by Sarah Chen
          </span>
        </ItemFooter>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Product Roadmap</ItemTitle>
          <ItemDescription>
            Planned features and improvements scheduled for the next three
            months.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">12 comments</span>
        </ItemFooter>
      </Item>
    </>
  )
}
