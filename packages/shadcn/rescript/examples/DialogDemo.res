@react.component
let make = () =>
  <Dialog>
    <form>
      <Dialog.Trigger render={<Button variant=Button.Variant.Outline />}>
        {"Open Dialog"->React.string}
      </Dialog.Trigger>
      <Dialog.Content className="sm:max-w-sm">
        <Dialog.Header>
          <Dialog.Title> {"Edit profile"->React.string} </Dialog.Title>
          <Dialog.Description>
            {"Make changes to your profile here. Click save when you're done."->React.string}
          </Dialog.Description>
        </Dialog.Header>
        <Field.Group>
          <Field>
            <Label htmlFor="name-1"> {"Name"->React.string} </Label>
            <Input id="name-1" name="name" defaultValue="Pedro Duarte"> {React.null} </Input>
          </Field>
          <Field>
            <Label htmlFor="username-1"> {"Username"->React.string} </Label>
            <Input id="username-1" name="username" defaultValue="@peduarte"> {React.null} </Input>
          </Field>
        </Field.Group>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant=Button.Variant.Outline />}>
            {"Cancel"->React.string}
          </Dialog.Close>
          <Button type_="submit"> {"Save changes"->React.string} </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </form>
  </Dialog>
