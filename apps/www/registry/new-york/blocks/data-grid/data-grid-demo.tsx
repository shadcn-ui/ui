"use client"

import * as React from "react"
import { MoreHorizontal, Plus } from "lucide-react"

import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"

import { DataGrid, DataGridColumn } from "./components/data-grid"

// Sample data type
interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  role: string
  lastLogin: string
}

// Sample data
const sampleData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "Admin",
    lastLogin: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    role: "User",
    lastLogin: "2024-01-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "pending",
    role: "User",
    lastLogin: "2024-01-12",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "active",
    role: "Editor",
    lastLogin: "2024-01-14",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "active",
    role: "User",
    lastLogin: "2024-01-13",
  },
]

export default function DataGridDemo() {
  const [data, setData] = React.useState<User[]>(sampleData)
  const [loading, setLoading] = React.useState(false)
  const [selectedRows, setSelectedRows] = React.useState<User[]>([])

  const columns: DataGridColumn<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      // enableSorting: true by default - this column is sortable
      meta: {
        className: "font-medium",
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      enableHiding:false
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as User["status"]
        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "inactive"
                ? "secondary"
                : "outline"
            }
          >
            {status}
          </Badge>
        )
      },
      meta: {
        align: "center",
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      // Sortable by default
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      meta: {
        align: "right",
      },
    },
    {
      accessorKey: "id",
      header: "Actions",
      enableSorting: false, // Disable sorting for actions column
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View user</DropdownMenuItem>
              <DropdownMenuItem>Edit user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      meta: {
        className: "w-[50px]",
      },
    },
  ]

  const handleAddUser = () => {
    const newUser: User = {
      id: String(data.length + 1),
      name: `User ${data.length + 1}`,
      email: `user${data.length + 1}@example.com`,
      status: "pending",
      role: "User",
      lastLogin: new Date().toISOString().split("T")[0],
    }
    setData([...data, newUser])
  }

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Data Grid Demo</h1>
        <p className="text-muted-foreground">
          A powerful and flexible data grid component built with TanStack Table
          and shadcn/ui.
        </p>
      </div>

      {selectedRows.length > 0 && (
        <div className="mb-4 rounded-lg bg-muted p-4">
          <p className="text-sm font-medium">
            Selected {selectedRows.length} user{selectedRows.length > 1 ? "s" : ""}:
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedRows.map(row => row.name).join(", ")}
          </p>
        </div>
      )}

      <DataGrid
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search users..."
        enableRowSelection
        enableColumnVisibility
        enablePagination
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        onRowClick={() => {
          // Handle row click
        }}
        onSelectionChange={setSelectedRows}
        loading={loading}
        height="600px"
        stickyHeader
        toolbar={
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddUser} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        }
      />
    </div>
  )
}
