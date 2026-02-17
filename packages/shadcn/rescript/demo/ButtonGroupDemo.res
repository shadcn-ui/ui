@react.component
let make = () => {
  let (label, setLabel) = React.useState(() => "personal")

  <ButtonGroup>
    <ButtonGroup className="hidden sm:flex">
      <Button
        dataVariant=BaseUi.Types.Variant.Outline
        dataSize=BaseUi.Types.Size.Icon
        ariaLabel="Go Back"
      >
        <Icons.ArrowLeft />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button dataVariant=BaseUi.Types.Variant.Outline>{"Archive"->React.string}</Button>
      <Button dataVariant=BaseUi.Types.Variant.Outline>{"Report"->React.string}</Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button dataVariant=BaseUi.Types.Variant.Outline>{"Snooze"->React.string}</Button>
      <DropdownMenu>
        <DropdownMenu.Trigger
          render={
            <Button
              dataVariant=BaseUi.Types.Variant.Outline
              dataSize=BaseUi.Types.Size.Icon
              ariaLabel="More Options"
            />
          }
        >
          <Icons.MoreHorizontal />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align=BaseUi.Types.Align.End className="w-40">
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <Icons.MailCheck />
              {"Mark as Read"->React.string}
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Icons.Archive />
              {"Archive"->React.string}
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <Icons.Clock />
              {"Snooze"->React.string}
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Icons.CalendarPlus />
              {"Add to Calendar"->React.string}
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Icons.ListFilter />
              {"Add to List"->React.string}
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <Icons.Tag />
                {"Label As..."->React.string}
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.RadioGroup
                  value=label
                  onValueChange={(nextLabel, _) => setLabel(_ => nextLabel)}
                >
                  <DropdownMenu.RadioItem value="personal">{"Personal"->React.string}</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="work">{"Work"->React.string}</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="other">{"Other"->React.string}</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Group>
          <DropdownMenu.Separator>{React.null}</DropdownMenu.Separator>
          <DropdownMenu.Group>
            <DropdownMenu.Item dataVariant=BaseUi.Types.Variant.Destructive>
              <Icons.Trash2 />
              {"Trash"->React.string}
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </ButtonGroup>
  </ButtonGroup>
}
