"use client"

import * as React from "react"

import { Checkbox } from "@/styles/aria-nova/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/aria-nova/ui/table"

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

export function CheckboxInTable() {
  return (
    <Table aria-label="Users" selectionMode="multiple">
      <TableHeader>
        <TableHead className="w-8">
          <Checkbox
            id="select-all-checkbox"
            name="select-all-checkbox"
            slot="selection"
          />
        </TableHead>
        <TableHead isRowHeader>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
      </TableHeader>
      <TableBody>
        {tableData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <Checkbox
                id={`row-${row.id}-checkbox`}
                name={`row-${row.id}-checkbox`}
                slot="selection"
              />
            </TableCell>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
