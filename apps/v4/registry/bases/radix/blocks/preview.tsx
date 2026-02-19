"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { type IconLibraryName } from "shadcn/icons"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/radix/ui/alert-dialog"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/radix/ui/chart"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { Field } from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/radix/ui/radio-group"
import { Slider } from "@/registry/bases/radix/ui/slider"
import { Switch } from "@/registry/bases/radix/ui/switch"
import { Textarea } from "@/registry/bases/radix/ui/textarea"
import { RADII } from "@/registry/config"
import { STYLES } from "@/registry/styles"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const PREVIEW_ICONS = [
  {
    lucide: "CopyIcon",
    tabler: "IconCopy",
    hugeicons: "Copy01Icon",
    phosphor: "CopyIcon",
    remixicon: "RiFileCopyLine",
  },
  {
    lucide: "CircleAlertIcon",
    tabler: "IconExclamationCircle",
    hugeicons: "AlertCircleIcon",
    phosphor: "WarningCircleIcon",
    remixicon: "RiErrorWarningLine",
  },
  {
    lucide: "TrashIcon",
    tabler: "IconTrash",
    hugeicons: "Delete02Icon",
    phosphor: "TrashIcon",
    remixicon: "RiDeleteBinLine",
  },
  {
    lucide: "ShareIcon",
    tabler: "IconShare",
    hugeicons: "Share03Icon",
    phosphor: "ShareIcon",
    remixicon: "RiShareLine",
  },
  {
    lucide: "ShoppingBagIcon",
    tabler: "IconShoppingBag",
    hugeicons: "ShoppingBag01Icon",
    phosphor: "BagIcon",
    remixicon: "RiShoppingBagLine",
  },
  {
    lucide: "MoreHorizontalIcon",
    tabler: "IconDots",
    hugeicons: "MoreHorizontalCircle01Icon",
    phosphor: "DotsThreeIcon",
    remixicon: "RiMoreLine",
  },
  {
    lucide: "Loader2Icon",
    tabler: "IconLoader",
    hugeicons: "Loading03Icon",
    phosphor: "SpinnerIcon",
    remixicon: "RiLoaderLine",
  },
  {
    lucide: "PlusIcon",
    tabler: "IconPlus",
    hugeicons: "PlusSignIcon",
    phosphor: "PlusIcon",
    remixicon: "RiAddLine",
  },
  {
    lucide: "MinusIcon",
    tabler: "IconMinus",
    hugeicons: "MinusSignIcon",
    phosphor: "MinusIcon",
    remixicon: "RiSubtractLine",
  },
  {
    lucide: "ArrowLeftIcon",
    tabler: "IconArrowLeft",
    hugeicons: "ArrowLeft02Icon",
    phosphor: "ArrowLeftIcon",
    remixicon: "RiArrowLeftLine",
  },
  {
    lucide: "ArrowRightIcon",
    tabler: "IconArrowRight",
    hugeicons: "ArrowRight02Icon",
    phosphor: "ArrowRightIcon",
    remixicon: "RiArrowRightLine",
  },
  {
    lucide: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick02Icon",
    phosphor: "CheckIcon",
    remixicon: "RiCheckLine",
  },
  {
    lucide: "ChevronDownIcon",
    tabler: "IconChevronDown",
    hugeicons: "ArrowDown01Icon",
    phosphor: "CaretDownIcon",
    remixicon: "RiArrowDownSLine",
  },
  {
    lucide: "ChevronRightIcon",
    tabler: "IconChevronRight",
    hugeicons: "ArrowRight01Icon",
    phosphor: "CaretRightIcon",
    remixicon: "RiArrowRightSLine",
  },
] satisfies Record<IconLibraryName, string>[]

const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function PreviewExample() {
  const [params] = useDesignSystemSearchParams()

  const currentFont = React.useMemo(
    () => FONTS.find((font) => font.value === params.font),
    [params.font]
  )

  const currentStyle = React.useMemo(
    () => STYLES.find((style) => style.name === params.style),
    [params.style]
  )

  const radiusValue = React.useMemo(() => {
    const radius = RADII.find((r) => r.name === params.radius)
    return radius?.value ?? ""
  }, [params.radius])

  return (
    <ExampleWrapper className="w-full max-w-none! lg:p-0">
      <Example
        containerClassName="col-span-2 max-w-none"
        className="bg-muted dark:bg-background flex min-h-svh flex-col items-center justify-center border-none sm:p-16"
      >
        <div
          data-slot="capture-target"
          className="grid max-w-4xl gap-6 p-6 lg:grid-cols-2"
          style={
            {
              "--radius": radiusValue,
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-medium">
                    {currentStyle?.title} - {currentFont?.name}
                  </div>
                  <div className="text-muted-foreground text-base">
                    Designers love packing quirky glyphs into test phrases. This
                    is a preview of the typography styles.
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3.5">
                  {[
                    "Background",
                    "Primary",
                    "Secondary",
                    "Muted",
                    "Accent",
                    "Destructive",
                  ].map((variant) => (
                    <div
                      key={variant}
                      className="flex flex-col flex-wrap items-center gap-2"
                    >
                      <Card
                        className="ring-border aspect-square w-full bg-(--color) ring"
                        style={
                          {
                            "--color": `var(--${variant.toLowerCase()})`,
                          } as React.CSSProperties
                        }
                      />
                      <div className="hidden max-w-14 truncate text-[0.60rem] md:block">
                        {variant}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="hidden flex-1 md:flex">
              <CardContent className="flex-1">
                <ChartContainer
                  config={barChartConfig}
                  className="aspect-auto h-full w-auto"
                >
                  <BarChart accessibilityLayer data={barChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={4}
                    />
                    <Bar
                      dataKey="mobile"
                      fill="var(--color-mobile)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <Card className="hidden md:flex">
              <CardContent>
                <div className="grid grid-cols-4 place-items-center gap-6 md:grid-cols-7">
                  {PREVIEW_ICONS.map((icon, index) => (
                    <Card
                      key={index}
                      className="ring-border flex size-8 items-center justify-center rounded-md p-0 ring *:[svg]:size-4"
                    >
                      <IconPlaceholder
                        lucide={icon.lucide}
                        tabler={icon.tabler}
                        hugeicons={icon.hugeicons}
                        phosphor={icon.phosphor}
                        remixicon={icon.remixicon}
                      />
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <Item variant="outline">
                    <ItemContent>
                      <ItemTitle>Two-factor authentication</ItemTitle>
                      <ItemDescription className="text-pretty xl:hidden 2xl:block">
                        Verify via email or phone number.
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="hidden md:flex">
                      <Button size="sm" variant="secondary">
                        Enable
                      </Button>
                    </ItemActions>
                  </Item>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge>Badge</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <div className="mt-2 flex gap-3 md:mt-0 md:ml-auto">
                      <Switch defaultChecked />
                      <RadioGroup
                        defaultValue="apple"
                        className="flex flex-row gap-3"
                      >
                        <RadioGroupItem value="apple" />
                        <RadioGroupItem value="banana" />
                      </RadioGroup>
                      <div className="flex flex-row gap-3">
                        <Checkbox defaultChecked />
                        <Checkbox />
                      </div>
                    </div>
                  </div>
                </div>
                <Field className="flex-row">
                  <Input placeholder="Name" />
                </Field>
                <Field className="flex-row">
                  <Textarea placeholder="Message" className="resize-none" />
                </Field>
                <Slider
                  value={[500]}
                  max={1000}
                  min={0}
                  step={10}
                  className="mt-2 w-full"
                  aria-label="Slider"
                />
                <div className="flex gap-2 md:gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <span className="hidden md:block">Alert Dialog</span>
                        <span className="block md:hidden">Dialog</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia>
                          <IconPlaceholder
                            lucide="BluetoothIcon"
                            tabler="IconBluetooth"
                            hugeicons="BluetoothIcon"
                            phosphor="BluetoothIcon"
                            remixicon="RiBluetoothLine"
                          />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                          Allow accessory to connect?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Do you want to allow the USB accessory to connect to
                          this device?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                        <AlertDialogAction>Allow</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <ButtonGroup>
                    <Button variant="outline">Button Group</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <IconPlaceholder
                            lucide="ChevronUpIcon"
                            tabler="IconChevronUp"
                            hugeicons="ArrowUp01Icon"
                            phosphor="CaretUpIcon"
                            remixicon="RiArrowUpSLine"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="VolumeX"
                              tabler="IconVolume"
                              hugeicons="VolumeOffIcon"
                              phosphor="SpeakerSlashIcon"
                              remixicon="RiVolumeMuteLine"
                            />
                            Mute Conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="CheckIcon"
                              tabler="IconCheck"
                              hugeicons="Tick02Icon"
                              phosphor="CheckIcon"
                              remixicon="RiCheckboxCircleLine"
                            />
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="UserRoundXIcon"
                              tabler="IconUserX"
                              hugeicons="UserRemove01Icon"
                              phosphor="UserMinusIcon"
                              remixicon="RiUserMinusLine"
                            />
                            Block User
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Conversation</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="ShareIcon"
                              tabler="IconShare"
                              hugeicons="Share03Icon"
                              phosphor="ShareIcon"
                              remixicon="RiShareLine"
                            />
                            Share Conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="CopyIcon"
                              tabler="IconCopy"
                              hugeicons="Copy01Icon"
                              phosphor="CopyIcon"
                              remixicon="RiFileCopyLine"
                            />
                            Copy Conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="AlertTriangleIcon"
                              tabler="IconAlertTriangle"
                              hugeicons="AlertCircleIcon"
                              phosphor="WarningIcon"
                              remixicon="RiErrorWarningLine"
                            />
                            Report Conversation
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem variant="destructive">
                            <IconPlaceholder
                              lucide="TrashIcon"
                              tabler="IconTrash"
                              hugeicons="Delete02Icon"
                              phosphor="TrashIcon"
                              remixicon="RiDeleteBinLine"
                            />
                            Delete Conversation
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ButtonGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Example>
    </ExampleWrapper>
  )
}
