@react.component
let make = () =>
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.Head> {"Product"->React.string} </Table.Head>
        <Table.Head> {"Price"->React.string} </Table.Head>
        <Table.Head className="text-right"> {"Actions"->React.string} </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell className="font-medium"> {"Wireless Mouse"->React.string} </Table.Cell>
        <Table.Cell> {"$29.99"->React.string} </Table.Cell>
        <Table.Cell className="text-right">
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={<Button variant=Button.Variant.Ghost size=Button.Size.Icon className="size-8" />}
            >
              <Icons.MoreHorizontal />
              <span className="sr-only"> {"Open menu"->React.string} </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align=BaseUi.Types.Align.End>
              <DropdownMenu.Item> {"Edit"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"Duplicate"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
              <DropdownMenu.Item variant=DropdownMenu.Variant.Destructive>
                {"Delete"->React.string}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell className="font-medium"> {"Mechanical Keyboard"->React.string} </Table.Cell>
        <Table.Cell> {"$129.99"->React.string} </Table.Cell>
        <Table.Cell className="text-right">
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={<Button variant=Button.Variant.Ghost size=Button.Size.Icon className="size-8" />}
            >
              <Icons.MoreHorizontal />
              <span className="sr-only"> {"Open menu"->React.string} </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align=BaseUi.Types.Align.End>
              <DropdownMenu.Item> {"Edit"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"Duplicate"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
              <DropdownMenu.Item variant=DropdownMenu.Variant.Destructive>
                {"Delete"->React.string}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell className="font-medium"> {"USB-C Hub"->React.string} </Table.Cell>
        <Table.Cell> {"$49.99"->React.string} </Table.Cell>
        <Table.Cell className="text-right">
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={<Button variant=Button.Variant.Ghost size=Button.Size.Icon className="size-8" />}
            >
              <Icons.MoreHorizontal />
              <span className="sr-only"> {"Open menu"->React.string} </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align=BaseUi.Types.Align.End>
              <DropdownMenu.Item> {"Edit"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Item> {"Duplicate"->React.string} </DropdownMenu.Item>
              <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
              <DropdownMenu.Item variant=DropdownMenu.Variant.Destructive>
                {"Delete"->React.string}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
