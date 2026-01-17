"use client"

import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function SidebarInsetExample() {
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="HomeIcon"
            tabler="IconHome"
            hugeicons="Home01Icon"
            phosphor="HouseIcon"
            remixicon="RiHomeLine"
          />
        ),
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "#",
          },
          {
            title: "Analytics",
            url: "#",
          },
        ],
      },
      {
        title: "Analytics",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="ChartLineIcon"
            tabler="IconChartLine"
            hugeicons="ChartIcon"
            phosphor="ChartLineIcon"
            remixicon="RiLineChartLine"
          />
        ),
        items: [
          {
            title: "Reports",
            url: "#",
          },
          {
            title: "Metrics",
            url: "#",
          },
        ],
      },
      {
        title: "Orders",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="ShoppingBagIcon"
            tabler="IconShoppingBag"
            hugeicons="ShoppingBag01Icon"
            phosphor="BagIcon"
            remixicon="RiShoppingBagLine"
          />
        ),
        items: [
          {
            title: "All Orders",
            url: "#",
          },
          {
            title: "Pending",
            url: "#",
          },
          {
            title: "Completed",
            url: "#",
          },
        ],
      },
      {
        title: "Products",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="ShoppingCartIcon"
            tabler="IconShoppingCart"
            hugeicons="ShoppingCart01Icon"
            phosphor="ShoppingCartIcon"
            remixicon="RiShoppingCartLine"
          />
        ),
        items: [
          {
            title: "All Products",
            url: "#",
          },
          {
            title: "Categories",
            url: "#",
          },
        ],
      },
      {
        title: "Invoices",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="FileIcon"
            tabler="IconFile"
            hugeicons="File01Icon"
            phosphor="FileIcon"
            remixicon="RiFileLine"
          />
        ),
      },
      {
        title: "Customers",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="UserIcon"
            tabler="IconUser"
            hugeicons="UserIcon"
            phosphor="UserIcon"
            remixicon="RiUserLine"
          />
        ),
      },
      {
        title: "Settings",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="Settings2Icon"
            tabler="IconSettings"
            hugeicons="Settings05Icon"
            phosphor="GearIcon"
            remixicon="RiSettingsLine"
          />
        ),
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="LifeBuoy"
            tabler="IconLifebuoy"
            hugeicons="ChartRingIcon"
            phosphor="LifebuoyIcon"
            remixicon="RiLifebuoyLine"
          />
        ),
      },
      {
        title: "Feedback",
        url: "#",
        icon: (
          <IconPlaceholder
            lucide="Send"
            tabler="IconSend"
            hugeicons="SentIcon"
            phosphor="PaperPlaneTiltIcon"
            remixicon="RiSendPlaneLine"
          />
        ),
      },
    ],
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.isActive}
                  render={<SidebarMenuItem />}
                >
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    isActive={item.isActive}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuAction className="data-open:rotate-90" />
                        }
                      >
                        <IconPlaceholder
                          lucide="ChevronRightIcon"
                          tabler="IconChevronRight"
                          hugeicons="ArrowRight01Icon"
                          phosphor="CaretRightIcon"
                          remixicon="RiArrowRightSLine"
                        />
                        <span className="sr-only">Toggle</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                render={<a href={subItem.url} />}
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<a href={item.url} />} size="sm">
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
