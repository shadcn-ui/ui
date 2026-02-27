let sheetSides = [
  (BaseUi.Types.Side.Top, "top"),
  (BaseUi.Types.Side.Right, "right"),
  (BaseUi.Types.Side.Bottom, "bottom"),
  (BaseUi.Types.Side.Left, "left"),
]

let loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

let triggerClassName =
  Button.twMerge(`${Button.buttonVariants(~variant=Button.Variant.Outline)} capitalize`)

@react.component
let make = () =>
  <div className="flex flex-wrap gap-2">
    {sheetSides
    ->Array.map(((side, label)) =>
      <Sheet key=label>
        <Sheet.Trigger className=triggerClassName type_="button">
          {label->React.string}
        </Sheet.Trigger>
        <Sheet.Content
          side
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <Sheet.Header>
            <Sheet.Title> {"Edit profile"->React.string} </Sheet.Title>
            <Sheet.Description>
              {"Make changes to your profile here. Click save when you're done."->React.string}
            </Sheet.Description>
          </Sheet.Header>
          <div className="no-scrollbar overflow-y-auto px-4">
            {Array.fromInitializer(~length=10, index =>
              <p key={Int.toString(index)} className="mb-2 leading-relaxed">
                {loremIpsum->React.string}
              </p>
            )->React.array}
          </div>
          <Sheet.Footer>
            <Button type_="submit"> {"Save changes"->React.string} </Button>
            <Sheet.Close render={<Button variant=Button.Variant.Outline />}>
              {"Cancel"->React.string}
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet>
    )
    ->React.array}
  </div>
