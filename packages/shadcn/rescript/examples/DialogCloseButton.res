@react.component
let make = () =>
  <Dialog>
    <Dialog.Trigger render={<Button variant=Button.Variant.Outline />}>
      {"Share"->React.string}
    </Dialog.Trigger>
    <Dialog.Content className="sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title> {"Share link"->React.string} </Dialog.Title>
        <Dialog.Description>
          {"Anyone who has this link will be able to view this."->React.string}
        </Dialog.Description>
      </Dialog.Header>
      <div className="flex items-center gap-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only"> {"Link"->React.string} </Label>
          <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
        </div>
      </div>
      <Dialog.Footer className="sm:justify-start">
        <Dialog.Close render={<Button type_="button" />}> {"Close"->React.string} </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
