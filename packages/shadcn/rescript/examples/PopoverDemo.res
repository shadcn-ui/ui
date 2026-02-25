@react.component
let make = () =>
  <Popover>
    <Popover.Trigger render={<Button variant=BaseUi.Types.Variant.Outline />}>
      {"Open popover"->React.string}
    </Popover.Trigger>
    <Popover.Content className="w-80">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="leading-none font-medium"> {"Dimensions"->React.string} </h4>
          <p className="text-muted-foreground text-sm">
            {"Set the dimensions for the layer."->React.string}
          </p>
        </div>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="width"> {"Width"->React.string} </Label>
            <Input id="width" defaultValue="100%" className="col-span-2 h-8"> {React.null} </Input>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="maxWidth"> {"Max. width"->React.string} </Label>
            <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8">
              {React.null}
            </Input>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="height"> {"Height"->React.string} </Label>
            <Input id="height" defaultValue="25px" className="col-span-2 h-8"> {React.null} </Input>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="maxHeight"> {"Max. height"->React.string} </Label>
            <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8">
              {React.null}
            </Input>
          </div>
        </div>
      </div>
    </Popover.Content>
  </Popover>
