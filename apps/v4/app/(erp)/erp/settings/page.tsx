"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Progress } from "@/registry/new-york-v4/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york-v4/ui/tooltip"
import { 
  Users, 
  Shield, 
  Database, 
  Building, 
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[{
                  icon: UserCog,
                  label: "Add New User"
                }, {
                  icon: Upload,
                  label: "Import Data"
                }, {
                  icon: Download,
                  label: "Export Backup"
                }, {
                  icon: Lock,
                  label: "Security Audit"
                }].map((action) => {
                  const Icon = action.icon
                  return (
                    <Tooltip key={action.label}>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" disabled={productionMode}>
                          <Icon className="h-6 w-6" />
                          <span className="text-sm">{action.label}</span>
                        </Button>
                      </TooltipTrigger>
                      {productionMode && (
                        <TooltipContent className="text-sm">{productionTooltip}</TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
            {productionMode && (
              <p className="mt-3 text-sm text-amber-800">{productionHelper}</p>
            )}
          </CardContent>
        </Card>
      featured: true
    },
    {
      title: "Quotations",
      description: "Manage quotations, view reports, and export documents",
      icon: QuoteIcon,
      href: "/erp/sales/quotations",
      color: "bg-indigo-100 text-indigo-600",
      stats: "Sales Module",
      featured: true
    },
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
      title: "Master Data",
      description: "Manage lookup tables, departments, positions, and reference data",
      icon: FolderTree,
      href: "/erp/settings/master-data",
      color: "bg-emerald-100 text-emerald-600",
      stats: "HRIS & Sales",
      featured: true
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
    <div className="flex-1 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">
              Manage your Ocean ERP system configuration and administrative settings
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={productionMode}>
                  <Settings2 className="mr-2 h-4 w-4" />
                  Quick Setup
                </Button>
              </TooltipTrigger>
              {productionMode && (
                <TooltipContent className="text-sm">{productionTooltip}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
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
            const isFeatured = module.featured
            return (
              <Card 
                key={module.title} 
                className={`group hover:shadow-md transition-shadow cursor-pointer ${
                  isFeatured ? 'border-2 border-primary shadow-sm' : ''
                }`}
              >
                <Link href={module.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${module.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <Badge 
                        variant={isFeatured ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {module.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {module.title}
                      {isFeatured && <span className="ml-2 text-xs text-primary">⭐</span>}
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
  )
}