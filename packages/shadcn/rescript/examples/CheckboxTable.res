@@directive("'use client'")

type row = {
  id: string,
  name: string,
  email: string,
  role: string,
}

let tableData: array<row> = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "User",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
]

@react.component
let make = () => {
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.Head className="w-8">
          <Checkbox id="select-all-checkbox" name="select-all-checkbox" checked={false} />
        </Table.Head>
        <Table.Head> {"Name"->React.string} </Table.Head>
        <Table.Head> {"Email"->React.string} </Table.Head>
        <Table.Head> {"Role"->React.string} </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {tableData
      ->Array.map(row => {
        let isSelected = row.id == "1"
        <Table.Row
          key=row.id dataState=?{
            if isSelected {
              Some("selected")
            } else {
              None
            }
          }
        >
          <Table.Cell>
            <Checkbox
              id={`row-${row.id}-checkbox`}
              name={`row-${row.id}-checkbox`}
              checked=isSelected
            />
          </Table.Cell>
          <Table.Cell className="font-medium"> {row.name->React.string} </Table.Cell>
          <Table.Cell> {row.email->React.string} </Table.Cell>
          <Table.Cell> {row.role->React.string} </Table.Cell>
        </Table.Row>
      })
      ->React.array}
    </Table.Body>
  </Table>
}
