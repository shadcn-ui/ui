@@directive("'use client'")

@react.component
let make = () => {
  let (isOpen, setIsOpen) = React.useState(() => false)

  <Card className="mx-auto w-full max-w-xs" dataSize=Card.Size.Sm>
    <Card.Header>
      <Card.Title> {"Radius"->React.string} </Card.Title>
      <Card.Description>
        {"Set the corner radius of the element."->React.string}
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <Collapsible
        open_=isOpen
        onOpenChange={(nextOpen, _) => setIsOpen(_ => nextOpen)}
        className="flex items-start gap-2"
      >
        <Field.Group className="grid w-full grid-cols-2 gap-2">
          <Field>
            <Field.Label htmlFor="radius-x" className="sr-only"> {"Radius X"->React.string} </Field.Label>
            <Input id="radius" placeholder="0" defaultValue="0" />
          </Field>
          <Field>
            <Field.Label htmlFor="radius-y" className="sr-only"> {"Radius Y"->React.string} </Field.Label>
            <Input id="radius" placeholder="0" defaultValue="0" />
          </Field>
          <Collapsible.Content className="col-span-full grid grid-cols-subgrid gap-2">
            <Field>
              <Field.Label htmlFor="radius-x" className="sr-only">
                {"Radius X"->React.string}
              </Field.Label>
              <Input id="radius" placeholder="0" defaultValue="0" />
            </Field>
            <Field>
              <Field.Label htmlFor="radius-y" className="sr-only">
                {"Radius Y"->React.string}
              </Field.Label>
              <Input id="radius" placeholder="0" defaultValue="0" />
            </Field>
          </Collapsible.Content>
        </Field.Group>
        <Collapsible.Trigger
          render={<button
            className={Button.buttonVariants(~variant=Button.Variant.Outline, ~size=Button.Size.Icon)}
            type_="button"
          />}
        >
          {if isOpen {<Icons.Minimize />} else {<Icons.Maximize />}}
        </Collapsible.Trigger>
      </Collapsible>
    </Card.Content>
  </Card>
}
