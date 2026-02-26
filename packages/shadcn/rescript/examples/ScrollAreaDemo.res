let tags = Array.make(~length=50, 0)->Array.mapWithIndex((_, index) => `v1.2.0-beta.${Int.toString(50 - index)}`)

@react.component
let make = () =>
  <ScrollArea className="h-72 w-48 rounded-md border">
    <div className="p-4">
      <h4 className="mb-4 text-sm leading-none font-medium"> {"Tags"->React.string} </h4>
      {tags
      ->Array.map(tag =>
        <React.Fragment key=tag>
          <div className="text-sm"> {tag->React.string} </div>
          <Separator className="my-2" />
        </React.Fragment>
      )
      ->React.array}
    </div>
  </ScrollArea>
