"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Progress } from "@/registry/new-york-v4/ui/progress"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { 
  Users, 
  Shield, 
  Database, 
  Building, 
  Settings2, 
  Download, 
  Upload, 
  FileText,
  Globe,
  Lock,
  UserCog,
  Archive
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const settingsModules = [
    {
      title: "General Settings",
      description: "Configure application preferences, themes, and basic settings",
      icon: Settings2,
      href: "/erp/settings/general",
      color: "bg-blue-100 text-blue-600",
      stats: "12 settings configured"
    },
    {
      title: "User Management",
      description: "Manage users, create accounts, and handle user permissions",
      icon: Users,
      href: "/erp/settings/users",
      color: "bg-green-100 text-green-600",
      stats: "45 active users"
    },
    {
      title: "Role & Permissions",
      description: "Define roles, assign permissions, and manage access control",
      icon: Shield,
      href: "/erp/settings/roles",
      color: "bg-purple-100 text-purple-600",
      stats: "8 roles defined"
    },
    {
      title: "Master Data",
      description: "Manage lookup tables, categories, and reference data",
      icon: Database,
      href: "/erp/settings/master-data",
      color: "bg-orange-100 text-orange-600",
      stats: "25 data tables"
    },
    {
      title: "Company Profile",
      description: "Update company information, logos, and business details",
      icon: Building,
      href: "/erp/settings/company",
      color: "bg-cyan-100 text-cyan-600",
      stats: "Profile updated"
    },
    {
      title: "System Configuration",
      description: "Configure system parameters, integrations, and advanced settings",
      icon: Settings2,
      href: "/erp/settings/system",
      color: "bg-red-100 text-red-600",
      stats: "15 configurations"
    },
    {
      title: "Data Import/Export",
      description: "Import data from external sources or export system data",
      icon: Archive,
      href: "/erp/settings/data-management",
      color: "bg-yellow-100 text-yellow-600",
      stats: "Last sync: 2 days ago"
    },
    {
      title: "Audit Logs",
      description: "View system activities, user actions, and security logs",
      icon: FileText,
      href: "/erp/settings/audit",
      color: "bg-gray-100 text-gray-600",
      stats: "1,234 log entries"
    }
  ]

  const systemHealth = [
    { label: "Database Performance", value: 92, color: "bg-green-500" },
    { label: "Storage Usage", value: 67, color: "bg-blue-500" },
    { label: "API Response Time", value: 88, color: "bg-green-500" },
    { label: "Cache Hit Rate", value: 94, color: "bg-green-500" }
  ]

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">
              Manage your Ocean ERP system configuration and administrative settings
            </p>
          </div>
          <Button>
            <Settings2 className="mr-2 h-4 w-4" />
            Quick Setup
          </Button>
        </div>

        {/* System Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Current system performance and status indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealth.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {settingsModules.map((module) => {
            const IconComponent = module.icon
            return (
              <Card key={module.title} className="group hover:shadow-md transition-shadow cursor-pointer">
                <Link href={module.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${module.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {module.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <UserCog className="h-6 w-6" />
                <span className="text-sm">Add New User</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span className="text-sm">Import Data</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="h-6 w-6" />
                <span className="text-sm">Export Backup</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Lock className="h-6 w-6" />
                <span className="text-sm">Security Audit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}