@react.component
let make = () =>
  <Sheet>
    <Sheet.Trigger render={<Button variant=Button.Variant.Outline />}>
      {"Open"->React.string}
    </Sheet.Trigger>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title> {"Edit profile"->React.string} </Sheet.Title>
        <Sheet.Description>
          {"Make changes to your profile here. Click save when you're done."->React.string}
        </Sheet.Description>
      </Sheet.Header>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div className="grid gap-3">
          <Label htmlFor="sheet-demo-name"> {"Name"->React.string} </Label>
          <Input id="sheet-demo-name" defaultValue="Pedro Duarte"> {React.null} </Input>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="sheet-demo-username"> {"Username"->React.string} </Label>
          <Input id="sheet-demo-username" defaultValue="@peduarte"> {React.null} </Input>
        </div>
      </div>
      <Sheet.Footer>
        <Button type_="submit"> {"Save changes"->React.string} </Button>
        <Sheet.Close render={<Button variant=Button.Variant.Outline />}>
          {"Close"->React.string}
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet>
