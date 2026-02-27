@react.component
let make = () =>
  <Breadcrumb>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link render={<a href="/" />}> {"Home"->React.string} </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>
        <Icons.Dot />
      </Breadcrumb.Separator>
      <Breadcrumb.Item>
        <DropdownMenu>
          <DropdownMenu.Trigger render={<button className="flex items-center gap-1" type_="button" />}>
            {"Components"->React.string}
            <Icons.ChevronDown dataIcon="inline-end" />
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
      <Breadcrumb.Separator>
        <Icons.Dot />
      </Breadcrumb.Separator>
      <Breadcrumb.Item>
        <Breadcrumb.Page> {"Breadcrumb"->React.string} </Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb>
