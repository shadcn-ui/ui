"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxCheckedChangeDetails,
} from "@/registry/bases/ark/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/ark/ui/table"

export default function CheckboxExample() {
  return (
    <ExampleWrapper>
      <CheckboxBasic />
      <CheckboxWithDescription />
      <CheckboxInvalid />
      <CheckboxDisabled />
      <CheckboxInTable />
      <CheckboxGroupDemo />
    </ExampleWrapper>
  )
}

function CheckboxBasic() {
  return (
    <Example title="Basic">
      <Checkbox id="terms">Accept terms and conditions</Checkbox>
    </Example>
  )
}

function CheckboxWithDescription() {
  return (
    <Example title="With Description">
      <Checkbox id="terms-2" defaultChecked>
        Accept terms and conditions
      </Checkbox>
    </Example>
  )
}

function CheckboxInvalid() {
  return (
    <Example title="Invalid">
      <Checkbox id="terms-3" aria-invalid>
        Accept terms and conditions
      </Checkbox>
    </Example>
  )
}

function CheckboxDisabled() {
  return (
    <Example title="Disabled">
      <Checkbox id="toggle" disabled>
        Enable notifications
      </Checkbox>
    </Example>
  )
}

const tableData = [
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

function CheckboxInTable() {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set(["1"])
  )

  const selectAll = selectedRows.size === tableData.length

  const handleSelectAll = (details: CheckboxCheckedChangeDetails) => {
    if (details.checked) {
      setSelectedRows(new Set(tableData.map((row) => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (
    id: string,
    details: CheckboxCheckedChangeDetails
  ) => {
    const newSelected = new Set(selectedRows)
    if (details.checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  return (
    <Example title="In Table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.id}
              data-state={selectedRows.has(row.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  id={`row-${row.id}`}
                  checked={selectedRows.has(row.id)}
                  onCheckedChange={(details) =>
                    handleSelectRow(row.id, details)
                  }
                  aria-label={`Select ${row.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Example>
  )
}

function CheckboxGroupDemo() {
  return (
    <Example title="Group">
      <CheckboxGroup
        defaultValue={["hard-disks"]}
        name="finder-pref"
        className="flex flex-col gap-3"
      >
        <Checkbox value="hard-disks">Hard disks</Checkbox>
        <Checkbox value="external-disks">External disks</Checkbox>
        <Checkbox value="cds-dvds">CDs, DVDs, and iPods</Checkbox>
        <Checkbox value="connected-servers">Connected servers</Checkbox>
      </CheckboxGroup>
    </Example>
  )
}
