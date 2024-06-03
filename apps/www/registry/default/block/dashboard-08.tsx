"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
// React lib for charts
// https://www.tremor.so/docs/getting-started/installation
import { DonutChart, Legend, ProgressBar, SparkAreaChart } from "@tremor/react"
import {
  AreaChartIcon,
  BellIcon,
  BoxesIcon,
  FlagIcon,
  InspectionPanelIcon,
  LayoutGridIcon,
  LucideIcon,
  Package2Icon,
  PackageIcon,
  PanelLeftIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react"
// https://usehooks-ts.com/react-hook/use-media-query
import { useMediaQuery } from "usehooks-ts"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/default/ui/table"

type SideNavItem = {
  label: string
  icon: LucideIcon
  link: string
  items?: SideNavItem[]
}

type ChartDataItem = {
  month: string
  Performance: number
}

type DashboardStatsItem = {
  label: string
  value: string | number
  color: string
  chartData: ChartDataItem[]
}

type RowTableDataItem = {
  customerName: string
  email: string
  type: string
  status: {
    label: string
    variant: "secondary" | "outline" | "default" | "destructive"
  }
  date: string
  amount: string
}

const sideNavBarItems: SideNavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutGridIcon,
    link: "#dashboard",
  },
  {
    label: "Orders",
    icon: ShoppingCartIcon,
    link: "#",
  },
  {
    label: "Customers",
    icon: Users2Icon,
    link: "#",
    items: [
      {
        label: "Customer 1",
        icon: User2Icon,
        link: "#",
      },
      {
        label: "Customer 2",
        icon: User2Icon,
        link: "#",
      },
    ],
  },
  {
    label: "Products",
    icon: BoxesIcon,
    link: "#",
    items: [
      {
        label: "Product 1",
        icon: PackageIcon,
        link: "#",
        items: [
          {
            label: "Overview",
            icon: InspectionPanelIcon,
            link: "#",
          },
          {
            label: "Reports",
            icon: FlagIcon,
            link: "#",
          },
          {
            label: "Analytics",
            icon: AreaChartIcon,
            link: "#",
          },
          {
            label: "Settings",
            icon: SettingsIcon,
            link: "#",
          },
        ],
      },
      {
        label: "Product 2",
        icon: PackageIcon,
        link: "#",
        items: [
          {
            label: "Overview",
            icon: InspectionPanelIcon,
            link: "#",
          },
          {
            label: "Reports",
            icon: FlagIcon,
            link: "#",
          },
          {
            label: "Analytics",
            icon: AreaChartIcon,
            link: "#",
          },
          {
            label: "Settings",
            icon: SettingsIcon,
            link: "#",
          },
        ],
      },
    ],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    link: "#",
  },
]

const dashboardStats: DashboardStatsItem[] = [
  {
    label: "Total Orders",
    value: 1500,
    color: "purple",
    chartData: generateChartData(1500),
  },
  {
    label: "Total Sales",
    value: "$50,000",
    color: "orange",
    chartData: generateChartData(5000),
  },
  {
    label: "Online Sessions",
    value: 3000,
    color: "emerald",
    chartData: generateChartData(3000),
  },
  {
    label: "Avg Order Value",
    value: "$33.33",
    color: "pink",
    chartData: generateChartData(33.33),
  },
]

// Generating random data with more variability
function generateChartData(baseValue: number) {
  const months = [
    "Jan 21",
    "Feb 21",
    "Mar 21",
    "Apr 21",
    "May 21",
    "Jun 21",
    "Jul 21",
  ]
  const chartData = months.map((month) => ({
    month: month,
    Performance: baseValue * (0.8 + Math.random() * 0.4),
  }))
  return chartData
}

const rowTableData: RowTableDataItem[] = [
  {
    customerName: "Liam Johnson",
    email: "liam@example.com",
    type: "Sale",
    status: { label: "Fulfilled", variant: "secondary" },
    date: "2023-06-23",
    amount: "$250.00",
  },
  {
    customerName: "Olivia Smith",
    email: "olivia@example.com",
    type: "Refund",
    status: { label: "Declined", variant: "outline" },
    date: "2023-06-24",
    amount: "$150.00",
  },
  {
    customerName: "Noah Williams",
    email: "noah@example.com",
    type: "Subscription",
    status: { label: "Fulfilled", variant: "secondary" },
    date: "2023-06-25",
    amount: "$350.00",
  },
  {
    customerName: "Emma Brown",
    email: "emma@example.com",
    type: "Sale",
    status: { label: "Fulfilled", variant: "secondary" },
    date: "2023-06-26",
    amount: "$450.00",
  },
]

const inStockItems = [
  { name: "Shoes", quantity: 35 },
  { name: "T-shirts", quantity: 15 },
  { name: "Jeans", quantity: 60 },
  { name: "Hats", quantity: 46 },
  { name: "Socks", quantity: 20 },
]

const pathname = "#dashboard"

const NAV_WIDTH = 280

export default function Dashboard() {
  const [navOpen, setNavOpen] = useState(true)
  const isMd = useMediaQuery("(min-width: 768px)")
  const [mainMargin, setMainMargin] = useState<number | undefined>(NAV_WIDTH)

  useEffect(() => {
    setNavOpen(isMd)
  }, [isMd])

  useEffect(() => {
    setMainMargin(isMd && navOpen ? NAV_WIDTH : undefined)
  }, [isMd, navOpen])

  return (
    <div className="bg-muted/40 min-h-screen">
      <TopNavigation setNavOpen={setNavOpen} />

      <section
        style={{ width: NAV_WIDTH }}
        className={cn(
          "bg-background fixed inset-y-0 z-10 pt-20 transition-all duration-500",
          !navOpen && "-translate-x-full"
        )}
      >
        <SideNavigation />
      </section>

      <main
        style={{ marginLeft: mainMargin }}
        className={"relative p-4 pt-20 transition-all duration-500"}
      >
        <div className="mx-auto max-w-7xl">
          <Overview />
        </div>
      </main>
    </div>
  )
}

const TopNavigation = ({
  setNavOpen,
}: {
  setNavOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between p-3">
      <div className="flex items-center space-x-3 md:space-x-6">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="text-foreground/50"
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <PanelLeftIcon className="h-4 w-4" />
        </Button>

        <Link href="#" className="flex items-center">
          <span className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold">
            <Package2Icon className="h-4 w-4" />
          </span>
          <span className="ml-3 hidden font-bold tracking-widest sm:block">
            Acme Inc
          </span>
        </Link>
      </div>
      <div className="flex items-center space-x-3 md:space-x-6">
        <Button size={"icon"} variant={"ghost"}>
          <SearchIcon className="h-4 w-4" />
        </Button>

        <Button size={"icon"} variant={"ghost"}>
          <BellIcon className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <User2Icon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

const SideNavigation = () => {
  return (
    <nav className="px-2">
      <Accordion type="multiple" className="space-y-1">
        {sideNavBarItems.map((item) => (
          <SideNavigationItem key={item.label} item={item} />
        ))}
      </Accordion>
    </nav>
  )
}

const SideNavigationItem = ({ item }: { item: SideNavItem }) => {
  return (
    <AccordionItem value={item.label} className="border-none">
      <div
        className={cn(
          "text-muted-foreground hover:text-primary group relative flex items-center rounded-md p-1 text-sm font-medium",
          !!item.items?.length && "pr-8",
          pathname === item.link && "bg-primary/10 text-primary"
        )}
      >
        <Link href={item.link} className="flex w-full items-center p-2">
          <item.icon className="mr-2 h-5 w-5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>

        {!!item.items?.length && (
          <AccordionTrigger className="absolute inset-y-0 right-0 shrink-0 p-2" />
        )}
      </div>

      {!!item.items?.length && (
        <AccordionContent className="ml-6">
          {item.items.map((subItem) => (
            <SideNavigationItem key={subItem.label} item={subItem} />
          ))}
        </AccordionContent>
      )}
    </AccordionItem>
  )
}

const Overview = () => {
  return (
    <div className="space-y-8">
      <h1 className="scroll-m-20 pb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
        Dashboard
      </h1>

      <section className="grid grid-cols-1 gap-2 md:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-2 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <TableCard />
        </div>

        <div className="lg:col-span-1">
          <DonutChatCard />
        </div>
      </section>
    </div>
  )
}

const StatCard = ({ item }: { item: DashboardStatsItem }) => {
  return (
    <Card className="grid grid-cols-2 py-6 pl-4 pr-2">
      <CardHeader className="p-0">
        <CardDescription>{item.label}</CardDescription>
        <CardTitle>{item.value}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <SparkAreaChart
          data={item.chartData}
          categories={["Performance"]}
          index={"month"}
          colors={[item.color]}
          curveType="monotone"
          className="h-10 w-full sm:h-14"
        />
      </CardContent>
    </Card>
  )
}

const TableCard = () => {
  return (
    <Card>
      <CardHeader className="px-4">
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowTableData.map((data, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-accent/20" : ""}
              >
                <TableCell>
                  <div className="font-medium">{data.customerName}</div>
                  <div className="text-muted-foreground hidden text-sm md:inline">
                    {data.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {data.type}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant={data.status.variant}>
                    {data.status.label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {data.date}
                </TableCell>
                <TableCell className="text-right">{data.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const DonutChatCard = () => {
  return (
    <Card>
      <CardHeader className="px-4">
        <CardTitle>In Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-evenly lg:block">
          <DonutChart
            data={inStockItems}
            category="quantity"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            className="my-4 size-32 max-w-40 text-xl font-bold lg:mx-auto"
          />
          <Legend
            categories={["Shoes", "T-shirts", "Jeans", "Hats", "Socks"]}
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            className="max-w-xs p-2"
          />
        </div>
      </CardContent>

      <CardFooter className="flex-col">
        <p className="flex w-full items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          <span>176 / 391</span> <span>45%</span>
        </p>
        <ProgressBar value={45} color="teal" className="mt-1.5" />
      </CardFooter>
    </Card>
  )
}
