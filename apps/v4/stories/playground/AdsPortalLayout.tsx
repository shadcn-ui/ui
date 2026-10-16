/**
 * Shared Ads Portal layout for the playground screens.
 *
 * Composition of library components only (Sidebar, DropdownMenu, Badge,
 * Button) — no custom primitives. Screens render their content as children
 * and it is placed inside the library's SidebarInset.
 */
import * as React from "react"
import {
  ChevronsUpDownIcon,
  CircleUserRoundIcon,
  CoinsIcon,
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageSquareTextIcon,
  PlusIcon,
  UserRoundCogIcon,
} from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/new-york-v4/ui/sidebar"

// Figma text styles -> Tailwind classes (plain strings, not components).
export const text = {
  h1: "text-[22px] leading-[30px] font-bold",
  h3: "text-base leading-[22px] font-bold",
  md: "text-xs leading-4 font-medium",
  mdSemibold: "text-xs leading-4 font-semibold",
  mdRegular: "text-xs leading-4 font-normal",
  smRegular: "text-[10px] leading-[14px] font-normal",
  caption: "text-[color:var(--noir-50)]",
}

const navButton =
  "h-auto min-h-9 gap-1.5 py-2 pr-2 pl-4 [&>svg]:size-[18px] data-[active=true]:bg-transparent data-[active=true]:text-primary"

export function AdsPortalLayout({
  children,
  contentClassName = "",
}: {
  children: React.ReactNode
  contentClassName?: string
}) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "211px" } as React.CSSProperties}
      className="h-[713px] min-h-0 min-w-[1268px] bg-muted"
    >
      {/* ------------------------------------------------------------ nav */}
      <Sidebar
        collapsible="none"
        className="bg-linear-to-b from-background to-secondary"
      >
        <SidebarHeader className="gap-3 p-4 pb-2">
          <div className="flex items-center gap-2">
            <Badge className="h-[22px] w-8 rounded-sm">M</Badge>
            <span
              className={`${text.mdSemibold} leading-[11px] text-foreground uppercase`}
            >
              Advertisement
              <br />
              Portal
            </span>
          </div>

          <p
            className={`-mx-4 flex items-center gap-1 px-0 whitespace-nowrap ${text.md} text-[color:var(--atlantic-100-base)]`}
          >
            <GlobeIcon className="size-[18px]" />
            Indian Standard Time (GMT +05:30)
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="h-[52px] gap-2 bg-background p-0 pr-2"
              >
                <Badge className="h-full w-[26px] rounded-none rounded-l-md border-0 bg-[color:var(--jade-10)] px-0 text-[8px] font-bold text-[color:var(--jade-140)] [writing-mode:vertical-rl] rotate-180">
                  AD ACC.
                </Badge>
                <span className={`flex-1 truncate ${text.md}`}>
                  maninder.singh@myntra.com
                </span>
                <ChevronsUpDownIcon className="size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>maninder.singh@myntra.com</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>

        <SidebarContent className="gap-0">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                <SidebarMenuItem>
                  <SidebarMenuButton className={navButton}>
                    <HomeIcon /> Home
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className={navButton}>
                    <MegaphoneIcon /> Manage Campaign
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="px-3 py-1">
                  <Button size="sm" className="h-7 text-xs">
                    <PlusIcon /> Create New Campaign
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel
              className={`h-auto px-4 pt-3 pb-1 uppercase ${text.smRegular} ${text.caption}`}
            >
              Reports
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {[
                  "Product Listing Ads (PLA)",
                  "Product Contextual Ads (PCA)",
                  "Additional Reports",
                ].map((label) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton className={navButton}>
                      <FileTextIcon /> {label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel
              className={`h-auto px-4 pt-3 pb-1 uppercase ${text.smRegular} ${text.caption}`}
            >
              Budget Source
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                <SidebarMenuItem>
                  <SidebarMenuButton className={navButton}>
                    <MessageSquareTextIcon /> Release Orders
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="right-3 rounded-full bg-secondary px-1.5 text-secondary-foreground">
                    15
                  </SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className={navButton}>
                    <CoinsIcon /> Free Credit
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="right-3 rounded-full bg-secondary px-1.5 text-secondary-foreground">
                    02
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel
              className={`h-auto px-4 pt-3 pb-1 uppercase ${text.smRegular} ${text.caption}`}
            >
              Account Control
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                <SidebarMenuItem>
                  <SidebarMenuButton className={navButton}>
                    <UserRoundCogIcon /> Manage Users
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className={navButton}>
                    <CircleUserRoundIcon /> Account Details
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <div className="overflow-hidden rounded-md bg-background">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="h-auto flex-col items-start gap-0 rounded-none px-3 py-2">
                  <span className="flex w-full items-center justify-between text-sm font-medium">
                    Maninder Singh
                    <ChevronsUpDownIcon className="size-4" />
                  </span>
                  <span className={`${text.smRegular} ${text.caption}`}>
                    maninder.singh@myntra.com
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge className="w-full justify-start rounded-none px-3 py-1 text-xs">
              Network Admin
            </Badge>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className={`relative mt-[5px] mr-1.5 mb-1 rounded-xl p-4 ${contentClassName}`}>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
