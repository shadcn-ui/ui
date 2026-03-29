"use client"

import { Card } from "@/registry/bases/radix/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/bases/radix/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function SidebarNav() {
  return (
    <Card className="overflow-hidden py-0">
      <SidebarProvider className="min-h-0">
        <Sidebar collapsible="none" className="w-full bg-transparent">
          <SidebarContent className="gap-0">
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <IconPlaceholder
                        lucide="LayoutDashboardIcon"
                        tabler="IconLayoutDashboard"
                        hugeicons="DashboardSquare01Icon"
                        phosphor="SquaresFourIcon"
                        remixicon="RiDashboardLine"
                      />
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconPlaceholder
                        lucide="ArrowLeftRightIcon"
                        tabler="IconArrowsLeftRight"
                        hugeicons="ArrowDataTransferHorizontalIcon"
                        phosphor="ArrowsLeftRightIcon"
                        remixicon="RiArrowLeftRightLine"
                      />
                      Transactions
                      <SidebarMenuBadge>24</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconPlaceholder
                        lucide="TrendingUpIcon"
                        tabler="IconTrendingUp"
                        hugeicons="AnalyticsUpIcon"
                        phosphor="TrendUpIcon"
                        remixicon="RiLineChartLine"
                      />
                      Investments
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconPlaceholder
                        lucide="TargetIcon"
                        tabler="IconTarget"
                        hugeicons="Target02Icon"
                        phosphor="TargetIcon"
                        remixicon="RiFocus3Line"
                      />
                      Goals
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconPlaceholder
                        lucide="WalletIcon"
                        tabler="IconWallet"
                        hugeicons="Wallet01Icon"
                        phosphor="WalletIcon"
                        remixicon="RiWalletLine"
                      />
                      Budget
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconPlaceholder
                        lucide="FileBarChartIcon"
                        tabler="IconReportAnalytics"
                        hugeicons="ChartBarLineIcon"
                        phosphor="ChartBarIcon"
                        remixicon="RiBarChartLine"
                      />
                      Reports
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </Card>
  )
}
