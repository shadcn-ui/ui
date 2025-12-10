"use client"

import * as React from "react"
import Image from "next/image"
import {
  Building2,
  Users,
  ShoppingCart,
  Package,
  Cog,
  Calculator,
  TrendingUp,
  FileText,
  Wallet,
  UserCheck,
  Award,
  Calendar,
  PieChart,
  Truck,
  Factory,
} from "lucide-react"

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/registry/new-york-v4/ui/sidebar"

// ERP navigation data
const data = {
  navMain: [
    {
      title: "Sales",
      url: "/erp/sales",
      icon: TrendingUp,
      isActive: false,
      items: [
        {
          title: "Leads",
          url: "/erp/sales/leads",
        },
        {
          title: "Opportunities",
          url: "/erp/sales/opportunities",
        },
        {
          title: "Quotations",
          url: "/erp/sales/quotations",
        },
        {
          title: "Sales Orders",
          url: "/erp/sales/orders",
        },
        {
          title: "Customers",
          url: "/erp/sales/customers",
        },
        {
          title: "Sales Analytics",
          url: "/erp/sales/analytics",
        },
      ],
    },
    {
      title: "Product",
      url: "/erp/product",
      icon: Package,
      isActive: false,
      items: [
        {
          title: "Product Catalog",
          url: "/erp/product/catalog",
        },
        {
          title: "Inventory",
          url: "/erp/product/inventory",
        },
        {
          title: "Stock Management",
          url: "/erp/product/stock",
        },
        {
          title: "Warehouses",
          url: "/erp/product/warehouses",
        },
        {
          title: "Purchase Orders",
          url: "/erp/product/purchase-orders",
        },
        {
          title: "Suppliers",
          url: "/erp/product/suppliers",
        },
      ],
    },
    {
      title: "Operations",
      url: "/erp/operations",
      icon: Factory,
      isActive: false,
      items: [
        {
          title: "Manufacturing",
          url: "/erp/operations/manufacturing",
        },
        {
          title: "Production Planning",
          url: "/erp/operations/planning",
        },
        {
          title: "Quality Control",
          url: "/erp/operations/quality",
        },
        {
          title: "Logistics",
          url: "/erp/operations/logistics",
        },
        {
          title: "Supply Chain",
          url: "/erp/operations/supply-chain",
        },
        {
          title: "Project Management",
          url: "/erp/operations/projects",
        },
      ],
    },
    {
      title: "Accounting",
      url: "/erp/accounting",
      icon: Calculator,
      isActive: false,
      items: [
        {
          title: "Chart of Accounts",
          url: "/erp/accounting/chart-of-accounts",
        },
        {
          title: "General Ledger",
          url: "/erp/accounting/general-ledger",
        },
        {
          title: "Accounts Payable",
          url: "/erp/accounting/payable",
        },
        {
          title: "Accounts Receivable",
          url: "/erp/accounting/receivable",
        },
        {
          title: "Financial Reports",
          url: "/erp/accounting/reports",
        },
        {
          title: "Budgeting",
          url: "/erp/accounting/budgeting",
        },
      ],
    },
    {
      title: "HRIS",
      url: "/erp/hris",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Employees",
          url: "/erp/hris/employees",
        },
        {
          title: "Recruitment",
          url: "/erp/hris/recruitment",
        },
        {
          title: "Payroll",
          url: "/erp/hris/payroll",
        },
        {
          title: "Performance",
          url: "/erp/hris/performance",
        },
        {
          title: "Training",
          url: "/erp/hris/training",
        },
        {
          title: "Leave Management",
          url: "/erp/hris/leave",
        },
      ],
    },
    {
      title: "Settings",
      url: "/erp/settings",
      icon: Cog,
      isActive: false,
      items: [
        {
          title: "General Settings",
          url: "/erp/settings/general",
        },
        {
          title: "User Management",
          url: "/erp/settings/users",
        },
        {
          title: "Role & Permissions",
          url: "/erp/settings/roles",
        },
        {
          title: "Master Data",
          url: "/erp/settings/master-data",
        },
        {
          title: "Company Profile",
          url: "/erp/settings/company",
        },
        {
          title: "System Configuration",
          url: "/erp/settings/system",
        },
        {
          title: "Data Import/Export",
          url: "/erp/settings/data-management",
        },
        {
          title: "Audit Logs",
          url: "/erp/settings/audit",
        },
      ],
    },
  ],
}

export function ERPSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/erp">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src="/images/ocean-erp-logo.svg"
                    alt="Ocean ERP Logo"
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                    priority
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ocean ERP</span>
                  <span className="truncate text-xs">Enterprise System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <a href="/erp/settings">
                <Cog className="size-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}