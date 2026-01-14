import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/examples/base/ui/item"

export function ItemHeaderAndFooterExamples() {
  return (
    <>
      <Item>
        <ItemHeader>
          <span className="text-sm font-medium">Team Project</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Website Redesign</ItemTitle>
          <ItemDescription>
            Complete overhaul of the company website with modern design
            principles and improved user experience.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Updated 5 minutes ago
          </span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <span className="text-sm font-medium">Client Work</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Mobile App Development</ItemTitle>
          <ItemDescription>
            Building a cross-platform mobile application for iOS and Android
            with React Native.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Status: In Progress
          </span>
        </ItemFooter>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <span className="text-sm font-medium">Documentation</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>API Integration Guide</ItemTitle>
          <ItemDescription>
            Step-by-step instructions for integrating third-party APIs with
            authentication and error handling.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Category: Technical • 3 attachments
          </span>
        </ItemFooter>
      </Item>
    </>
  )
}
