"use client"

import * as React from "react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Area, AreaChart } from "recharts"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Alert, AlertDescription } from "@/registry/bases/base/ui/alert"
import { Badge } from "@/registry/bases/base/ui/badge"
import { Button } from "@/registry/bases/base/ui/button"
import { Calendar } from "@/registry/bases/base/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/base/ui/chart"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { Textarea } from "@/registry/bases/base/ui/textarea"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function VercelBlock() {
  return (
    <ExampleWrapper>
      <DeploymentFilter />
      <UsageCard />
      <ObservabilityCard />
      <BillingList />
      <AnomalyAlert />
      <ActivateAgentDialog />
      <FeedbackForm />
      <AnalyticsCard />
    </ExampleWrapper>
  )
}

const items = [
  {
    name: "Edge Requests",
    value: "$1.83K",
    percentage: 67.34,
  },
  {
    name: "Fast Data Transfer",
    percentage: 52.18,
    value: "$952.51",
  },
  {
    name: "Monitoring data points",
    percentage: 89.42,
    value: "$901.20",
  },
  {
    name: "Web Analytics Events",
    percentage: 45.67,
    value: "$603.71",
  },
  {
    name: "Edge Request CPU Duration",
    percentage: 23.91,
    value: "$4.65",
  },
  {
    name: "Fast Origin Transfer",
    percentage: 38.75,
    value: "$3.85",
  },
  {
    name: "ISR Reads",
    percentage: 71.24,
    value: "$2.86",
  },
  {
    name: "Function Invocations",
    percentage: 15.83,
    value: "$0.60",
  },
  {
    name: "ISR Writes",
    percentage: 26.23,
    value: "524.52K / 2M",
  },
  {
    name: "Function Duration",
    percentage: 5.11,
    value: "5.11 GB Hrs / 1K GB Hrs",
  },
]

function UsageCard() {
  return (
    <Example title="Usage" className="items-center">
      <Card className="w-full max-w-sm gap-4">
        <CardHeader>
          <CardTitle className="px-1 text-sm">
            5 days remaining in cycle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-0">
            {items.map((item) => (
              <Item
                key={item.name}
                size="xs"
                className="px-0 group-hover/item-group:bg-transparent"
                render={<a href="#" />}
              >
                <ItemMedia variant="icon" className="text-primary">
                  <CircularGauge percentage={item.percentage} />
                </ItemMedia>
                <ItemContent className="inline-block truncate">
                  <ItemTitle className="inline">{item.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <span className="text-muted-foreground font-mono text-xs font-medium tabular-nums">
                    {item.value}
                  </span>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </Example>
  )
}

function AnomalyAlert() {
  return (
    <Example
      title="Anomaly Alert"
      className="aspect-square items-center justify-center"
    >
      <Card className="w-full max-w-xs">
        <CardContent className="p-6">
          <Empty className="mx-auto p-0">
            <EmptyHeader>
              <EmptyTitle>Get alerted for anomalies</EmptyTitle>
              <EmptyDescription>
                Automatically monitor your projects for anomalies and get
                notified.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Upgrade to Observability Plus</Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </Example>
  )
}

const environments = [
  "All Environments",
  "Production",
  "Preview",
  "Development",
  "Staging",
  "Test",
  "Other",
]

const statuses = [
  { name: "Ready", color: "oklch(0.72 0.19 150)" },
  { name: "Error", color: "oklch(0.64 0.21 25)" },
  { name: "Building", color: "oklch(0.77 0.16 70)" },
  { name: "Queued", color: "oklch(0.72 0.00 0)" },
  { name: "Provisioning", color: "oklch(0.72 0.00 0)" },
  { name: "Canceled", color: "oklch(0.72 0.00 0)" },
]

function DeploymentFilter() {
  const [selectedEnvironment, setSelectedEnvironment] = React.useState(
    environments[0]
  )
  const [selectedStatuses, setSelectedStatuses] = React.useState<Set<string>>(
    new Set(statuses.slice(0, 5).map((s) => s.name))
  )
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  const toggleStatus = (statusName: string) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(statusName)) {
        next.delete(statusName)
      } else {
        next.add(statusName)
      }
      return next
    })
  }

  return (
    <Example title="Deployment Filter" containerClassName="col-span-full">
      <div className="flex w-full flex-wrap items-center gap-2 *:w-full lg:*:w-auto">
        <Popover>
          <PopoverTrigger
            render={<Button variant="outline" className="justify-start" />}
          >
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar01Icon"
              phosphor="CalendarIcon"
              remixicon="RiCalendarLine"
              data-icon="inline-start"
              className="text-muted-foreground"
            />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Select Date Range"
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <InputGroup className="lg:ml-auto lg:max-w-72">
          <InputGroupAddon>
            <IconPlaceholder
              lucide="Search"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
            />
          </InputGroupAddon>
          <InputGroupInput placeholder="All Authors..." />
          <InputGroupAddon align="inline-end">
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="text-muted-foreground"
            />
          </InputGroupAddon>
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="justify-between" />}
          >
            {selectedEnvironment}
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              data-icon="inline-end"
              className="text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {environments.map((environment) => (
              <DropdownMenuItem
                key={environment}
                onSelect={() => setSelectedEnvironment(environment)}
                data-active={selectedEnvironment === environment}
              >
                {environment}
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                  className="ml-auto opacity-0 group-data-[active=true]/dropdown-menu-item:opacity-100"
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="justify-between" />}
          >
            <div className="flex items-center -space-x-0.5">
              {statuses.map((status) => (
                <div
                  key={status.name}
                  style={
                    {
                      "--color": status.color,
                    } as React.CSSProperties
                  }
                  className="size-2.5 shrink-0 rounded-full border grayscale transition-all data-[active=true]:border-(--color) data-[active=true]:bg-(--color) data-[active=true]:grayscale-0"
                  data-active={selectedStatuses.has(status.name)}
                />
              ))}
            </div>
            Status {selectedStatuses.size}/{statuses.length}
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              data-icon="inline-end"
              className="text-muted-foreground ml-auto"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {statuses.map((status) => {
              const isSelected = selectedStatuses.has(status.name)
              return (
                <DropdownMenuItem
                  key={status.name}
                  onSelect={() => toggleStatus(status.name)}
                  data-active={isSelected}
                  style={
                    {
                      "--color": status.color,
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-(--color)" />
                    {status.name}
                  </div>
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                    remixicon="RiCheckLine"
                    className="ml-auto opacity-0 group-data-[active=true]/dropdown-menu-item:opacity-100"
                  />
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Example>
  )
}

const billingItems = [
  {
    month: "November 2025",
    invoiceDate: new Date(2025, 10, 5),
    amount: "$10.00",
    status: "Paid" as const,
  },
  {
    month: "October 2025",
    invoiceDate: new Date(2025, 9, 4),
    amount: "$10.00",
    status: "Paid" as const,
  },
  {
    month: "September 2025",
    invoiceDate: new Date(2025, 8, 4),
    amount: "$10.00",
    status: "Paid" as const,
  },
]

function BillingList() {
  return (
    <Example
      title="Billing"
      className="items-center lg:p-16"
      containerClassName="col-span-full"
    >
      <ItemGroup className="max-w-7xl gap-0 rounded-lg border">
        {billingItems.map((item, index) => (
          <React.Fragment key={item.month}>
            <Item className="grid grid-cols-[1fr_auto] lg:grid-cols-[2fr_1fr_1fr_auto]">
              <ItemContent>
                <ItemTitle>
                  {item.month}
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {item.status}
                  </Badge>
                </ItemTitle>
                <ItemDescription>
                  Infrastructure usage & Vercel platform
                </ItemDescription>
              </ItemContent>
              <ItemContent className="hidden lg:flex">
                <ItemTitle>Total Due</ItemTitle>
                <ItemDescription>{item.amount}</ItemDescription>
              </ItemContent>
              <ItemContent className="hidden lg:flex">
                <ItemDescription>
                  Invoiced {format(item.invoiceDate, "d MMM yyyy")}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" />}
                  >
                    <IconPlaceholder
                      lucide="MoreHorizontalIcon"
                      tabler="IconDots"
                      hugeicons="MoreHorizontalCircle01Icon"
                      phosphor="DotsThreeOutlineIcon"
                      remixicon="RiMoreLine"
                    />
                    <span className="sr-only">More options</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View invoice</DropdownMenuItem>
                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Contact support</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
              <ItemFooter className="col-span-full w-full border-t pt-4 lg:hidden">
                <ItemContent>
                  <ItemTitle>Total Due</ItemTitle>
                  <ItemDescription>{item.amount}</ItemDescription>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    Invoiced {format(item.invoiceDate, "d MMM yyyy")}
                  </ItemDescription>
                </ItemContent>
              </ItemFooter>
            </Item>
            {index !== billingItems.length - 1 && (
              <ItemSeparator className="my-0" />
            )}
          </React.Fragment>
        ))}
      </ItemGroup>
    </Example>
  )
}

function CircularGauge({ percentage }: { percentage: number }) {
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)
  const circumference = 2 * Math.PI * 42.5
  const strokePercent = (normalizedPercentage / 100) * circumference

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      width="16"
      strokeWidth="2"
      viewBox="0 0 100 100"
      className="-rotate-90"
    >
      <circle
        cx="50"
        cy="50"
        r="42.5"
        strokeWidth="12"
        strokeDashoffset="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-20"
        stroke="currentColor"
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
        }}
      />
      <circle
        cx="50"
        cy="50"
        r="42.5"
        strokeWidth="12"
        strokeDashoffset="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        className="transition-all duration-300"
        style={{
          strokeDasharray: `${strokePercent} ${circumference}`,
        }}
      />
    </svg>
  )
}

const agentFeatures = [
  {
    id: "code-reviews",
    content: (
      <>
        <strong>Code reviews</strong> with full codebase context to catch{" "}
        <strong>hard-to-find</strong> bugs. bugs.
      </>
    ),
  },
  {
    id: "code-suggestions",
    content: (
      <>
        <strong>Code suggestions</strong> validated in sandboxes before you
        merge.
      </>
    ),
  },
  {
    id: "root-cause",
    content: (
      <>
        <strong>Root-cause analysis</strong> for production issues with
        deployment context.{" "}
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 hover:bg-blue-100"
        >
          Requires Observability Plus
        </Badge>
      </>
    ),
  },
]

function ActivateAgentDialog() {
  return (
    <Example title="Activate Agent" className="items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Activate Agent
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ship faster & safer with Vercel Agent</DialogTitle>
            <DialogDescription>
              Your use is subject to Vercel&apos;s{" "}
              <a href="#">Public Beta Agreement</a> and{" "}
              <a href="#">AI Product Terms</a>.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar flex max-h-[50vh] flex-col gap-4 overflow-y-auto">
            <ItemGroup className="gap-0 pr-2">
              {agentFeatures.map((feature) => (
                <Item key={feature.id} size="xs" className="px-0">
                  <ItemMedia variant="icon" className="self-start">
                    <IconPlaceholder
                      lucide="CheckCircle2Icon"
                      tabler="IconCircleCheckFilled"
                      hugeicons="CheckmarkCircle02Icon"
                      phosphor="CheckCircleIcon"
                      remixicon="RiCheckboxCircleLine"
                      className="fill-primary text-primary-foreground size-5"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-muted-foreground *:[strong]:text-foreground inline leading-relaxed font-normal *:[strong]:font-medium">
                      {feature.content}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
            <Alert className="hidden sm:grid">
              <IconPlaceholder
                lucide="CircleDollarSignIcon"
                hugeicons="DollarCircleIcon"
                tabler="IconCoin"
                phosphor="CurrencyCircleDollarIcon"
                remixicon="RiMoneyDollarCircleLine"
              />
              <AlertDescription>
                Pro teams get $100 in Vercel Agent trial credit for 2 weeks.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button>Enable with $100 credits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function ObservabilityCard() {
  return (
    <Example title="Observability" className="items-center justify-center">
      <Card className="relative w-full max-w-md overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural
            language. Monitoring will no longer be available on the Pro plan in
            November, 2025
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            Create Query{" "}
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-end"
            />
          </Button>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  )
}

function FeedbackForm() {
  return (
    <Example title="Feedback Form" className="items-center justify-center">
      <Card className="w-full max-w-sm" size="sm">
        <CardContent>
          <form id="feedback-form">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="topic">Topic</FieldLabel>
                <NativeSelect id="topic">
                  <NativeSelectOption value="">
                    Select a topic
                  </NativeSelectOption>
                  <NativeSelectOption value="ai">AI</NativeSelectOption>
                  <NativeSelectOption value="accounts-and-access-controls">
                    Accounts and Access Controls
                  </NativeSelectOption>
                  <NativeSelectOption value="billing">
                    Billing
                  </NativeSelectOption>
                  <NativeSelectOption value="cdn">
                    CDN (Firewall, Caching)
                  </NativeSelectOption>
                  <NativeSelectOption value="ci-cd">
                    CI/CD (Builds, Deployments, Environment Variables)
                  </NativeSelectOption>
                  <NativeSelectOption value="dashboard-interface">
                    Dashboard Interface (Navigation, UI Issues)
                  </NativeSelectOption>
                  <NativeSelectOption value="domains">
                    Domains
                  </NativeSelectOption>
                  <NativeSelectOption value="frameworks">
                    Frameworks
                  </NativeSelectOption>
                  <NativeSelectOption value="marketplace-and-integrations">
                    Marketplace and Integrations
                  </NativeSelectOption>
                  <NativeSelectOption value="observability">
                    Observability (Observability, Logs, Monitoring)
                  </NativeSelectOption>
                  <NativeSelectOption value="storage">
                    Storage
                  </NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
                <Textarea
                  id="feedback"
                  placeholder="Your feedback helps us improve..."
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="feedback-form">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </Example>
  )
}

const chartData = [
  { month: "January", visitors: 186 },
  { month: "February", visitors: 305 },
  { month: "March", visitors: 237 },
  { month: "April", visitors: 73 },
  { month: "May", visitors: 209 },
  { month: "June", visitors: 214 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function AnalyticsCard() {
  return (
    <Example title="Analytics Card" className="justify-center">
      <Card className="mx-auto w-full max-w-sm data-[size=sm]:pb-0" size="sm">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            418.2K Visitors <Badge>+10%</Badge>
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
          </CardAction>
        </CardHeader>
        <ChartContainer config={chartConfig} className="aspect-[1/0.35]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" hideLabel />}
              defaultIndex={2}
            />
            <Area
              dataKey="visitors"
              type="linear"
              fill="var(--color-visitors)"
              fillOpacity={0.4}
              stroke="var(--color-visitors)"
            />
          </AreaChart>
        </ChartContainer>
      </Card>
    </Example>
  )
}
