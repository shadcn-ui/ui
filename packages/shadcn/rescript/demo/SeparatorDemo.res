@react.component
let make = () =>
  <div className="flex max-w-sm flex-col gap-4 text-sm">
    <div className="flex flex-col gap-1.5">
      <div className="leading-none font-medium">{"shadcn/ui"->React.string}</div>
      <div className="text-muted-foreground">{"The Foundation for your Design System"->React.string}</div>
    </div>
    <Separator />
    <div>
      {"A set of beautifully designed components that you can customize, extend, and build on."
      ->React.string}
    </div>
  </div>
