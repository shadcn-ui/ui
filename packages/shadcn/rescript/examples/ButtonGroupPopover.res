@react.component
let make = () => {
  let triggerClassName =
    Button.buttonVariants(~variant=Button.Variant.Outline, ~size=Button.Size.Icon)

  <ButtonGroup>
    <Button variant=Button.Variant.Outline>
      <Icons.Bot />
      {"Copilot"->React.string}
    </Button>
    <Popover>
      <Popover.Trigger className=triggerClassName type_="button" ariaLabel="Open Popover">
        <Icons.ChevronDown />
      </Popover.Trigger>
      <Popover.Content align=BaseUi.Types.Align.End className="rounded-xl text-sm">
        <Popover.Header>
          <Popover.Title> {"Start a new task with Copilot"->React.string} </Popover.Title>
          <Popover.Description>
            {"Describe your task in natural language."->React.string}
          </Popover.Description>
        </Popover.Header>
        <Field>
          <Field.Label htmlFor="task" className="sr-only"> {"Task Description"->React.string} </Field.Label>
          <Textarea id="task" placeholder="I need to..." className="resize-none" />
          <Field.Description>
            {"Copilot will open a pull request for review."->React.string}
          </Field.Description>
        </Field>
      </Popover.Content>
    </Popover>
  </ButtonGroup>
}
