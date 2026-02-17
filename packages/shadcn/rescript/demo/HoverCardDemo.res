@react.component
let make = () =>
  <HoverCard>
    <HoverCard.Trigger
      delay={10.}
      closeDelay={100.}
      render={<Button dataVariant=BaseUi.Types.Variant.Link />}
    >
      {"Hover Here"->React.string}
    </HoverCard.Trigger>
    <HoverCard.Content className="flex w-64 flex-col gap-0.5">
      <div className="font-semibold">{"@nextjs"->React.string}</div>
      <div>{"The React Framework – created and maintained by @vercel."->React.string}</div>
      <div className="text-muted-foreground mt-1 text-xs">{"Joined December 2021"->React.string}</div>
    </HoverCard.Content>
  </HoverCard>
