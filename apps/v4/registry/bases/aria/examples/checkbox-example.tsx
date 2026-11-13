"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Checkbox } from "@/registry/bases/aria/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/bases/aria/ui/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/aria/ui/table"

export default function CheckboxExample() {
  return (
    <ExampleWrapper>
      <CheckboxBasic />
      <CheckboxWithDescription />
      <CheckboxInvalid />
      <CheckboxDisabled />
      <CheckboxWithTitle />
      <CheckboxInTable />
      <CheckboxGroup />
    </ExampleWrapper>
  )
}

function CheckboxBasic() {
  return (
    <Example title="Basic">
      <Field orientation="horizontal">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
      </Field>
    </Example>
  )
}

function CheckboxWithDescription() {
  return (
    <Example title="With Description">
      <Field orientation="horizontal">
        <Checkbox id="terms-2" defaultSelected />
        <FieldContent>
          <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </Example>
  )
}

function CheckboxInvalid() {
  return (
    <Example title="Invalid">
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="terms-3" isInvalid />
        <FieldLabel htmlFor="terms-3">Accept terms and conditions</FieldLabel>
      </Field>
    </Example>
  )
}

function CheckboxDisabled() {
  return (
    <Example title="Disabled">
      <Field orientation="horizontal">
        <Checkbox id="toggle" isDisabled />
        <FieldLabel htmlFor="toggle">Enable notifications</FieldLabel>
      </Field>
    </Example>
  )
}

function CheckboxWithTitle() {
  return (
    <Example title="With Title">
      <FieldGroup>
        <FieldLabel htmlFor="toggle-2">
          <Field orientation="horizontal">
            <Checkbox id="toggle-2" defaultSelected />
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="toggle-4">
          <Field orientation="horizontal" data-disabled>
            <Checkbox id="toggle-4" isDisabled />
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
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
  return (
    <Example title="In Table">
      <Table>
        <TableHeader>
          <TableHead className="w-8">
            <Checkbox slot="selection" />
          </TableHead>
          <TableHead isRowHeader>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox id={`row-${row.id}`} slot="selection" />
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

function CheckboxGroup() {
  return (
    <Example title="Group">
      <Field>
        <FieldLabel>Show these items on the desktop:</FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
          <FieldLabel
            htmlFor="finder-pref-9k2-hard-disks-ljj"
            className="font-normal"
          >
            Hard disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-external-disks-1yg" />
          <FieldLabel
            htmlFor="finder-pref-9k2-external-disks-1yg"
            className="font-normal"
          >
            External disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
          <FieldLabel
            htmlFor="finder-pref-9k2-cds-dvds-fzt"
            className="font-normal"
          >
            CDs, DVDs, and iPods
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
          <FieldLabel
            htmlFor="finder-pref-9k2-connected-servers-6l2"
            className="font-normal"
          >
            Connected servers
          </FieldLabel>
        </Field>
      </Field>
    </Example>
  )
}
