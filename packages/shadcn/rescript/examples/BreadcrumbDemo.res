@react.component
let make = () =>
  <Breadcrumb>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link render={<a href="#" />}> {"Home"->React.string} </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <DropdownMenu>
          <DropdownMenu.Trigger render={<Button size=IconSm variant=Ghost />}>
            <Breadcrumb.Ellipsis />
            <span className="sr-only"> {"Toggle menu"->React.string} </span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align=BaseUi.Types.Align.Start>
            <DropdownMenu.Group>
              <DropdownMenu.Item> {"Documentation"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"Themes"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"GitHub"->React.string} </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link render={<a href="#" />}> {"Components"->React.string} </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page> {"Breadcrumb"->React.string} </Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb>
