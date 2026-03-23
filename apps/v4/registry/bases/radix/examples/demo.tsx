"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/radix/ui/alert-dialog"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
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
import { Field, FieldGroup } from "@/registry/bases/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/radix/ui/input-group"
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
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function Demo() {
  const [sliderValue, setSliderValue] = React.useState<number[]>([500])
  const handleSliderValueChange = React.useCallback((value: number[]) => {
    setSliderValue(value)
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted p-4 sm:p-6 lg:p-12 dark:bg-background">
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Style Overview</CardTitle>
              <CardDescription className="line-clamp-2">
                Designers love packing quirky glyphs into test phrases. This is
                a preview of the typography styles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-3">
                {[
                  "--background",
                  "--foreground",
                  "--primary",
                  "--secondary",
                  "--muted",
                  "--accent",
                  "--border",
                  "--chart-1",
                  "--chart-2",
                  "--chart-3",
                  "--chart-4",
                  "--chart-5",
                ].map((variant) => (
                  <div
                    key={variant}
                    className="flex flex-col flex-wrap items-center gap-2"
                  >
                    <div
                      className="relative aspect-square w-full rounded-lg bg-(--color) after:absolute after:inset-0 after:rounded-lg after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten"
                      style={
                        {
                          "--color": `var(${variant})`,
                        } as React.CSSProperties
                      }
                    />
                    <div className="hidden max-w-14 truncate font-mono text-[0.60rem] md:block">
                      {variant}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="grid grid-cols-8 place-items-center gap-4">
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                    phosphor="CopyIcon"
                    remixicon="RiFileCopyLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="CircleAlertIcon"
                    tabler="IconExclamationCircle"
                    hugeicons="AlertCircleIcon"
                    phosphor="WarningCircleIcon"
                    remixicon="RiErrorWarningLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="TrashIcon"
                    tabler="IconTrash"
                    hugeicons="Delete02Icon"
                    phosphor="TrashIcon"
                    remixicon="RiDeleteBinLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="ShareIcon"
                    tabler="IconShare"
                    hugeicons="Share03Icon"
                    phosphor="ShareIcon"
                    remixicon="RiShareLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="ShoppingBagIcon"
                    tabler="IconShoppingBag"
                    hugeicons="ShoppingBag01Icon"
                    phosphor="BagIcon"
                    remixicon="RiShoppingBagLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="MoreHorizontalIcon"
                    tabler="IconDots"
                    hugeicons="MoreHorizontalCircle01Icon"
                    phosphor="DotsThreeIcon"
                    remixicon="RiMoreLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="Loader2Icon"
                    tabler="IconLoader"
                    hugeicons="Loading03Icon"
                    phosphor="SpinnerIcon"
                    remixicon="RiLoaderLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="MinusIcon"
                    tabler="IconMinus"
                    hugeicons="MinusSignIcon"
                    phosphor="MinusIcon"
                    remixicon="RiSubtractLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="ArrowLeftIcon"
                    tabler="IconArrowLeft"
                    hugeicons="ArrowLeft02Icon"
                    phosphor="ArrowLeftIcon"
                    remixicon="RiArrowLeftLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="ArrowRightIcon"
                    tabler="IconArrowRight"
                    hugeicons="ArrowRight02Icon"
                    phosphor="ArrowRightIcon"
                    remixicon="RiArrowRightLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                    remixicon="RiCheckLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="ChevronRightIcon"
                    tabler="IconChevronRight"
                    hugeicons="ArrowRight01Icon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="SearchIcon"
                    tabler="IconSearch"
                    hugeicons="Search01Icon"
                    phosphor="MagnifyingGlassIcon"
                    remixicon="RiSearchLine"
                  />
                </Card>
                <Card className="flex size-8 items-center justify-center rounded-md p-0 ring ring-border *:[svg]:size-4">
                  <IconPlaceholder
                    lucide="SettingsIcon"
                    tabler="IconSettings"
                    hugeicons="Settings01Icon"
                    phosphor="GearIcon"
                    remixicon="RiSettingsLine"
                  />
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card className="w-full">
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
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
              </div>
              <Slider
                value={sliderValue}
                onValueChange={handleSliderValueChange}
                max={1000}
                min={0}
                step={10}
                className="flex-1"
                aria-label="Slider"
              />
              <FieldGroup>
                <Field>
                  <InputGroup>
                    <InputGroupInput placeholder="Name" />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>
                        <IconPlaceholder
                          lucide="SearchIcon"
                          tabler="IconSearch"
                          hugeicons="Search01Icon"
                          phosphor="MagnifyingGlassIcon"
                          remixicon="RiSearchLine"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field className="flex-1">
                  <Textarea placeholder="Message" className="resize-none" />
                </Field>
              </FieldGroup>
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <Badge>Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <RadioGroup
                  defaultValue="apple"
                  className="ml-auto flex w-fit gap-3"
                >
                  <RadioGroupItem value="apple" />
                  <RadioGroupItem value="banana" />
                </RadioGroup>
                <div className="flex gap-3">
                  <Checkbox defaultChecked />
                  <Checkbox />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <span className="hidden md:block">Alert Dialog</span>
                      <span className="block md:hidden">Dialog</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Allow accessory to connect?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you want to allow the USB accessory to connect to
                        this device and your data?
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
                    <DropdownMenuContent
                      align="end"
                      side="top"
                      className="w-fit"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Conversation</DropdownMenuLabel>
                        <DropdownMenuItem>Share Conversation</DropdownMenuItem>
                        <DropdownMenuItem>Copy Conversation</DropdownMenuItem>
                        <DropdownMenuItem>Report Conversation</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem variant="destructive">
                          Delete Conversation
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ButtonGroup>
                <Switch defaultChecked className="ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
