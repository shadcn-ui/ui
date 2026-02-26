@@directive("'use client'")

@react.component
let make = () => {
  let (label, setLabel) = React.useState(() => "personal")

  <ButtonGroup>
    <ButtonGroup className="hidden sm:flex">
      <Button variant=Button.Variant.Outline size=Button.Size.Icon ariaLabel="Go Back">
        <Icons.ArrowLeft />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant=Button.Variant.Outline> {"Archive"->React.string} </Button>
      <Button variant=Button.Variant.Outline> {"Report"->React.string} </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant=Button.Variant.Outline> {"Snooze"->React.string} </Button>
      <DropdownMenu>
        <DropdownMenu.Trigger
          render={<Button
            variant=Button.Variant.Outline
            size=Button.Size.Icon
            ariaLabel="More Options"
          />}
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
          <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
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
                  value=label onValueChange={(nextLabel, _) => setLabel(_ => nextLabel)}
                >
                  <DropdownMenu.RadioItem value="personal">
                    {"Personal"->React.string}
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="work">
                    {"Work"->React.string}
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="other">
                    {"Other"->React.string}
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Group>
          <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
          <DropdownMenu.Group>
            <DropdownMenu.Item variant=DropdownMenu.Variant.Destructive>
              <Icons.Trash2 />
              {"Trash"->React.string}
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </ButtonGroup>
  </ButtonGroup>
}
