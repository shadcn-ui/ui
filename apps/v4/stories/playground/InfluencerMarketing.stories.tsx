import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  ArrowLeftIcon,
  BarChart3Icon,
  BriefcaseBusinessIcon,
  CheckCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDollarSignIcon,
  FilePenLineIcon,
  GridIcon,
  HandshakeIcon,
  HistoryIcon,
  InfoIcon,
  LayoutListIcon,
  ListChecksIcon,
  MegaphoneIcon,
  MoreVerticalIcon,
  PackageIcon,
  PlusIcon,
  ReceiptIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  TagIcon,
  TrendingUpIcon,
  UndoIcon,
  UploadIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

import { AspectRatio } from "@/registry/new-york-v4/ui/aspect-ratio"
import { Avatar, AvatarFallback } from "@/registry/new-york-v4/ui/avatar"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/new-york-v4/ui/sidebar"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"

/**
 * Playground — "Partner Portal › Influencer Marketing"
 * (Figma: Affiliate program for sellers, node 291:17298).
 *
 * Strictly library components: Sidebar, Card, Tabs, Select,
 * Input, Button, Badge, Avatar, Separator, AspectRatio, Skeleton. No custom
 * component files. Product photos are library Skeletons (placeholders).
 *
 * Colours: semantic tokens, or primitives from app/tokens/primitives.css where
 * no semantic token exists yet (success / info tints). No hex values.
 */

const tone = {
  success: "bg-[color:var(--jade-10)] text-[color:var(--jade-140)]",
  info: "bg-[color:var(--atlantic-10)] text-[color:var(--atlantic-140)]",
}
const caption = "text-[color:var(--noir-50)]"

const manage = [
  { icon: BriefcaseBusinessIcon, label: "Buying & Inventory" },
  { icon: ShoppingBagIcon, label: "Listings" },
  { icon: PackageIcon, label: "Orders & Returns" },
  { icon: TagIcon, label: "Pricing" },
  { icon: WalletIcon, label: "Payments" },
  { icon: MegaphoneIcon, label: "Promotion & Ads" },
  { icon: RocketIcon, label: "Growth" },
  { icon: HandshakeIcon, label: "Business Relations" },
  { icon: BarChart3Icon, label: "Business Health" },
  { icon: ListChecksIcon, label: "Reports" },
]
const services = [
  { icon: ReceiptIcon, label: "Rate Cards" },
  { icon: StarIcon, label: "Partner University" },
  { icon: CircleDollarSignIcon, label: "Seller Finance" },
  { icon: ShieldCheckIcon, label: "Seller Protection Fund" },
]

const stats = [
  { icon: UsersIcon, value: "30 Creators", note: "partnered on 60 listings" },
  { icon: TrendingUpIcon, value: "3x Reach", note: "20% more since last week" },
  { icon: FilePenLineIcon, value: "250 Orders", note: "received via influencers" },
  { icon: UndoIcon, value: "78 Customers", note: "acquired via marketing" },
]

const listings = [
  { brand: "Dressberry", name: "Women's Blue Bodycon Dress", id: "7424952586" },
  { brand: "Nayo", name: "Women's Maroon & Cream Kurta", id: "7424952587" },
  { brand: "Dressberry", name: "Green Fit and Flare Sleeveless", id: "7424952588" },
  { brand: "HnM", name: "Beige Ankle Length Fit and Flare", id: "7424952589" },
]

function InfluencerMarketing() {
  const [selected, setSelected] = React.useState<string[]>([])
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "232px" } as React.CSSProperties}
      className="min-h-[1203px] min-w-[1387px] bg-background"
    >
      {/* ------------------------------------------------------------ nav */}
      <Sidebar collapsible="none" className="border-r">
        <SidebarHeader className="gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-foreground">
              Partner Portal
            </span>
            <Button variant="ghost" size="icon-xs" aria-label="Collapse">
              <ChevronLeftIcon />
            </Button>
          </div>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
            <SidebarInput placeholder="Search..." className="pl-8" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel
              className={`text-[10px] uppercase ${caption}`}
            >
              Manage Business
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {manage.map(({ icon: Icon, label }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton className="h-8 text-xs font-medium">
                      <Icon />
                      {label}
                      <ChevronRightIcon className="ml-auto" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel
              className={`text-[10px] uppercase ${caption}`}
            >
              Services
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {services.map(({ icon: Icon, label }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      size="sm"
                      className="font-normal text-muted-foreground"
                    >
                      <Icon />
                      {label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>KC</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs font-medium text-foreground">
                Kalim Chogle
              </span>
              <span className={`truncate text-[10px] ${caption}`}>
                Adidas Fashions Pvt Ltd
              </span>
            </div>
            <Button variant="ghost" size="icon-xs" aria-label="More">
              <MoreVerticalIcon />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* ------------------------------------------------------- content */}
      <SidebarInset className="gap-4 bg-muted p-4">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" aria-label="Back">
              <ArrowLeftIcon />
            </Button>
            <h1 className="text-[22px] leading-[30px] font-bold text-foreground">
              Influencer Marketing
            </h1>
            <Button variant="link" size="sm" className="text-xs text-muted-foreground">
              <InfoIcon /> Terms and Conditions <ChevronRightIcon />
            </Button>
          </div>
          <Button variant="link" size="sm" className="text-sm">
            <UploadIcon /> Bulk Listing Opt In
          </Button>
        </div>

        {/* Promo cards + impact */}
        <div className="grid grid-cols-[1fr_1fr_2fr] gap-4">
          {[0, 1].map((i) => (
            <Card key={i} className="gap-3 py-4">
              <CardContent className="flex flex-col gap-3 px-4">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Badge variant="secondary" className={`size-6 rounded-full p-0 ${tone.info}`}>
                    <StarIcon />
                  </Badge>
                  Market Your Best Sellers
                </div>
                <p className="text-xs text-muted-foreground">
                  You can add <b className="text-foreground">25 recommended</b>{" "}
                  listings to influencer marketing today.
                </p>
                <Badge
                  variant="secondary"
                  className={`w-full justify-start rounded-sm py-1 text-xs font-normal ${tone.success}`}
                >
                  <TrendingUpIcon /> Potential{" "}
                  <b>4% increase</b> in sales.
                </Badge>
                <Separator />
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Market Listings <ChevronRightIcon />
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="gap-3 py-4">
            <CardContent className="flex flex-col gap-3 px-4">
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs font-medium">
                  Influencer Marketing Impact
                </span>
                <Separator className="flex-1" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {stats.map(({ icon: Icon, value, note }) => (
                  <Card key={value} className="gap-2 bg-muted py-4 shadow-none">
                    <CardContent className="flex flex-col items-center gap-2 px-3 text-center">
                      <Badge variant="secondary" className={`size-7 rounded-md p-0 ${tone.info}`}>
                        <Icon />
                      </Badge>
                      <span className="text-sm font-semibold">{value}</span>
                      <span className={`text-xs ${caption}`}>{note}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="recommended">
          <TabsList variant="line" className="w-full justify-start border-b">
            <TabsTrigger value="recommended" className="flex-none">
              <ShoppingBagIcon /> Recommended Listings (20)
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-none">
              <StarIcon /> Active Campaigns (40)
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-none">
              <HistoryIcon /> Campaign History
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex-none">
              <ListChecksIcon /> Bulk Upload Jobs
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="gap-3 py-4">
          <CardContent className="flex flex-col gap-3 px-4">
            <div className="flex items-center gap-3">
              <Input placeholder="Enter Listing ID" className="h-8 w-[200px] text-xs" />
              <Select>
                <SelectTrigger size="sm" className="w-[200px] text-xs">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dressberry">Dressberry</SelectItem>
                  <SelectItem value="nayo">Nayo</SelectItem>
                  <SelectItem value="hnm">HnM</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger size="sm" className="w-[200px] text-xs">
                  <SelectValue placeholder="Select Article Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dress">Dresses</SelectItem>
                  <SelectItem value="kurta">Kurtas</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-auto flex items-center gap-3">
                <Button variant="link" size="sm" className="text-xs">
                  Reset
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Apply
                </Button>
              </div>
            </div>
            <Tabs defaultValue="top">
              <TabsList variant="pills">
                {[
                  ["top", "Top Selling", "93"],
                  ["new", "New Selection", "104"],
                  ["ageing", "High Ageing", "56"],
                ].map(([value, label, count]) => (
                  <TabsTrigger key={value} value={value} className="gap-2 text-xs">
                    {label}
                    <Separator orientation="vertical" className="h-3" />
                    <span className="text-foreground">{count}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base leading-[22px] font-bold text-foreground">
              Top Selling Listings (10)
            </h2>
            <Tabs defaultValue="grid">
              <TabsList>
                <TabsTrigger value="grid">
                  <GridIcon /> Grid View
                </TabsTrigger>
                <TabsTrigger value="list">
                  <LayoutListIcon /> List View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected(listings.map((l) => l.id))}
          >
            <CheckCheckIcon /> Select All
          </Button>
        </div>

        {/* Listing grid */}
        <div className="grid grid-cols-4 gap-4 pb-28">
          {listings.concat(listings).map((item, i) => {
            const id = `${item.id}-${i}`
            const isSelected = selected.includes(id)
            return (
              <Card key={id} className="gap-3 py-4">
                <CardContent className="flex flex-col gap-3 px-4">
                  <AspectRatio ratio={232 / 240}>
                    <Skeleton className="size-full rounded-lg" />
                  </AspectRatio>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold">{item.brand}</span>
                    <span className="text-[10px] leading-[14px]">{item.name}</span>
                    <span className={`text-[10px] leading-[14px] ${caption}`}>
                      Listing:{" "}
                      <Button
                        asChild
                        variant="link"
                        className="h-auto p-0 text-[10px]"
                      >
                        <a href="#">#{item.id}</a>
                      </Button>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    aria-pressed={isSelected}
                    onClick={() => toggle(id)}
                  >
                    {isSelected ? (
                      <CheckCheckIcon />
                    ) : (
                      <PlusIcon />
                    )}
                    {isSelected ? "Selected" : "Select Listing"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sticky enrol bar */}
        <Card className="sticky bottom-4 mt-[-7rem] gap-0 py-4 shadow-lg">
          <CardContent className="flex items-center gap-6 px-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Listings Selected
              </span>
              <span className="text-2xl font-semibold">{selected.length}</span>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Min Commitment
              </span>
              <span className="text-2xl font-semibold">
                ₹{selected.length * 1000}
              </span>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <p className="flex flex-1 items-start gap-2 text-xs text-muted-foreground">
              <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
              Proceed to create influencer program, creators will create content
              and boost your sales. You pay per order.
            </p>
            <Button
              disabled={selected.length === 0}
              className="disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
            >
              Enroll Listings
            </Button>
          </CardContent>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  )
}

const meta = {
  title: "Playground/Partner Portal/Influencer Marketing",
  component: InfluencerMarketing,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InfluencerMarketing>

export default meta
type Story = StoryObj<typeof meta>

export const Screen: Story = {}
