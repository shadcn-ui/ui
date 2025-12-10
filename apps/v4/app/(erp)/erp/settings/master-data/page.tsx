"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import { 
  Database, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  FileText,
  Users,
  Package,
  MapPin,
  Tag,
  Calendar
} from "lucide-react"
import Link from "next/link"

export default function MasterDataPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const masterDataTables = [
    {
      name: "Lead Sources",
      description: "Sources where leads originate from",
      records: 9,
      lastUpdated: "2 days ago",
      category: "Sales",
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Lead Statuses",
      description: "Status tracking for lead progression",
      records: 6,
      lastUpdated: "1 week ago",
      category: "Sales",
      icon: Tag,
      color: "bg-green-100 text-green-600"
    },
    {
      name: "Sales Team Members",
      description: "Sales team members who can be assigned to leads",
      records: 12,
      lastUpdated: "1 day ago",
      category: "Sales",
      icon: Users,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      name: "Product Categories",
      description: "Categories for product classification",
      records: 15,
      lastUpdated: "3 days ago",
      category: "Product",
      icon: Package,
      color: "bg-purple-100 text-purple-600"
    },
    {
      name: "Countries",
      description: "List of supported countries",
      records: 195,
      lastUpdated: "1 month ago",
      category: "Geography",
      icon: MapPin,
      color: "bg-orange-100 text-orange-600"
    },
    {
      name: "Currencies",
      description: "Supported currency codes",
      records: 25,
      lastUpdated: "2 weeks ago",
      category: "Financial",
      icon: FileText,
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      name: "User Roles",
      description: "System roles and permissions",
      records: 8,
      lastUpdated: "1 day ago",
      category: "Security",
      icon: Users,
      color: "bg-red-100 text-red-600"
    },
    {
      name: "Department Types",
      description: "Organizational department categories",
      records: 12,
      lastUpdated: "5 days ago",
      category: "HRIS",
      icon: Users,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      name: "Holiday Calendar",
      description: "Company and regional holidays",
      records: 45,
      lastUpdated: "1 week ago",
      category: "HRIS",
      icon: Calendar,
      color: "bg-pink-100 text-pink-600"
    }
  ]

  const filteredTables = masterDataTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Sales": "bg-blue-100 text-blue-800",
      "Product": "bg-purple-100 text-purple-800",
      "Geography": "bg-orange-100 text-orange-800",
      "Financial": "bg-cyan-100 text-cyan-800",
      "Security": "bg-red-100 text-red-800",
      "HRIS": "bg-yellow-100 text-yellow-800",
    }
    
    return (
      <Badge className={categoryColors[category] || "bg-gray-100 text-gray-800"}>
        {category}
      </Badge>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Link 
            href="/erp/settings" 
            className="text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">Master Data</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Master Data Management</h2>
            <p className="text-muted-foreground">
              Manage lookup tables, categories, and reference data across your system
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Table
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{masterDataTables.length}</div>
              <p className="text-xs text-muted-foreground">Across all modules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {masterDataTables.reduce((sum, table) => sum + table.records, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Reference data entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(masterDataTables.map(table => table.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">Data categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Master Data Tables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Tables</CardTitle>
                <CardDescription>
                  Manage your system's reference data and lookup tables
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[250px]"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map((table) => {
                  const IconComponent = table.icon
                  const getTableLink = (tableName: string) => {
                    switch (tableName) {
                      case "Sales Team Members":
                        return "/erp/settings/master-data/sales-team"
                      default:
                        return null
                    }
                  }

                  const tableLink = getTableLink(table.name)

                  return (
                    <TableRow key={table.name} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${table.color}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            {tableLink ? (
                              <Link href={tableLink} className="font-medium hover:underline">
                                {table.name}
                              </Link>
                            ) : (
                              <div className="font-medium">{table.name}</div>
                            )}
                            <div className="text-sm text-muted-foreground">{table.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(table.category)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{table.records.toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {table.lastUpdated}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {tableLink ? (
                            <Link href={tableLink}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Data Management Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Bulk Import
              </CardTitle>
              <CardDescription>
                Import master data from CSV or Excel files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Import Data</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Export Data
              </CardTitle>
              <CardDescription>
                Export master data for backup or analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Export All</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600" />
                Data Validation
              </CardTitle>
              <CardDescription>
                Check data integrity and consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Run Validation</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}