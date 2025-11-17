"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/registry/bases/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { Field, FieldGroup } from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import { Label } from "@/registry/bases/radix/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ButtonGroupDemo() {
  const [currency, setCurrency] = useState("$")

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col gap-12 lg:flex-row">
        <div className="flex max-w-xs flex-col gap-6">
          <ButtonGroup>
            <Button variant="outline">Button</Button>
            <Input placeholder="Type something here..." />
          </ButtonGroup>
          <ButtonGroup>
            <Input placeholder="Type something here..." />
            <Button variant="outline">Button</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Button</Button>
            <Button variant="outline">Another Button</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>Text</ButtonGroupText>
            <Button variant="outline">Another Button</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText asChild>
              <Label htmlFor="input">GPU Size</Label>
            </ButtonGroupText>
            <Input id="input" placeholder="Type something here..." />
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>Prefix</ButtonGroupText>
            <Input id="input" placeholder="Type something here..." />
            <ButtonGroupText>Suffix</ButtonGroupText>
          </ButtonGroup>
          <div className="flex gap-4">
            <ButtonGroup>
              <Button variant="outline">Update</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <IconPlaceholder
                      lucide="ChevronDownIcon"
                      tabler="IconChevronDown"
                      hugeicons="ArrowDown01Icon"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Disable</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    Uninstall
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Follow</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <IconPlaceholder
                      lucide="ChevronDownIcon"
                      tabler="IconChevronDown"
                      hugeicons="ArrowDown01Icon"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="VolumeOffIcon"
                        tabler="IconVolume"
                        hugeicons="VolumeOffIcon"
                      />
                      Mute Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="CheckIcon"
                        tabler="IconCheck"
                        hugeicons="Tick02Icon"
                      />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="AlertTriangleIcon"
                        tabler="IconAlertTriangle"
                        hugeicons="AlertCircleIcon"
                      />
                      Report Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="UserRoundXIcon"
                        tabler="IconUserX"
                        hugeicons="UserRemove01Icon"
                      />
                      Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="ShareIcon"
                        tabler="IconShare"
                        hugeicons="Share03Icon"
                      />
                      Share Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="CopyIcon"
                        tabler="IconCopy"
                        hugeicons="Copy01Icon"
                      />
                      Copy Conversation
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                      <IconPlaceholder
                        lucide="TrashIcon"
                        tabler="IconTrash"
                        hugeicons="Delete02Icon"
                      />
                      Delete Conversation
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
          <Field>
            <Label htmlFor="amount">Amount</Label>
            <ButtonGroup>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="font-mono">{currency}</SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="$">$</SelectItem>
                  <SelectItem value="€">€</SelectItem>
                  <SelectItem value="£">£</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Enter amount to send" />
              <Button variant="outline">
                <IconPlaceholder
                  lucide="ArrowRightIcon"
                  tabler="IconArrowRight"
                  hugeicons="ArrowRight01Icon"
                />
              </Button>
            </ButtonGroup>
          </Field>
        </div>
        <div className="flex max-w-xs flex-col gap-6">
          <ButtonGroup>
            <Button variant="outline">
              <IconPlaceholder
                lucide="FlipHorizontalIcon"
                tabler="IconFlipHorizontal"
                hugeicons="FlipHorizontalIcon"
              />
            </Button>
            <Button variant="outline">
              <IconPlaceholder
                lucide="FlipVerticalIcon"
                tabler="IconFlipVertical"
                hugeicons="FlipVerticalIcon"
              />
            </Button>
            <Button variant="outline">
              <IconPlaceholder
                lucide="RotateCwIcon"
                tabler="IconRotateClockwise2"
                hugeicons="Rotate01Icon"
              />
            </Button>
            <InputGroup>
              <InputGroupInput placeholder="0.00" />
              <InputGroupAddon
                align="inline-end"
                className="text-muted-foreground"
              >
                <IconPlaceholder
                  lucide="PercentIcon"
                  tabler="IconPercentage"
                  hugeicons="PercentIcon"
                />
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>
          <InputGroup>
            <InputGroupInput placeholder="Type to search..." />
            <InputGroupAddon
              align="inline-start"
              className="text-muted-foreground"
            >
              <IconPlaceholder
                lucide="SearchIcon"
                tabler="IconSearch"
                hugeicons="Search01Icon"
              />
            </InputGroupAddon>
          </InputGroup>
          <FieldGroup className="grid grid-cols-3 gap-4">
            <Field className="col-span-2">
              <Label htmlFor="width">Width</Label>
              <ButtonGroup>
                <InputGroup>
                  <InputGroupInput id="width" />
                  <InputGroupAddon className="text-muted-foreground">
                    W
                  </InputGroupAddon>
                  <InputGroupAddon
                    align="inline-end"
                    className="text-muted-foreground"
                  >
                    px
                  </InputGroupAddon>
                </InputGroup>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="MinusIcon"
                    tabler="IconMinus"
                    hugeicons="MinusSignIcon"
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                  />
                </Button>
              </ButtonGroup>
            </Field>
            <Field>
              <Label htmlFor="color">Color</Label>
              <ButtonGroup className="w-full">
                <InputGroup>
                  <InputGroupInput id="color" />
                  <InputGroupAddon align="inline-start">
                    <Popover>
                      <PopoverTrigger asChild>
                        <InputGroupButton className="px-0">
                          <span className="bg-primary size-5 rounded-xs" />
                        </InputGroupButton>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="max-w-48 rounded-lg p-2"
                        alignOffset={-8}
                        sideOffset={8}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "#EA4335",
                            "#FBBC04",
                            "#34A853",
                            "#4285F4",
                            "#9333EA",
                            "#EC4899",
                            "#10B981",
                            "#F97316",
                            "#6366F1",
                            "#14B8A6",
                            "#8B5CF6",
                            "#F59E0B",
                          ].map((color) => (
                            <div
                              key={color}
                              className="size-6 cursor-pointer rounded-sm transition-transform hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                  <InputGroupAddon
                    align="inline-end"
                    className="text-muted-foreground"
                  >
                    %
                  </InputGroupAddon>
                </InputGroup>
              </ButtonGroup>
            </Field>
          </FieldGroup>
          <ButtonGroup>
            <Button variant="outline">
              <IconPlaceholder
                lucide="HeartIcon"
                tabler="IconBell"
                hugeicons="Notification02Icon"
                data-slot="icon-inline-start"
              />{" "}
              Like
            </Button>
            <Button variant="outline" asChild size="icon" className="w-12">
              <span>1.2K</span>
            </Button>
          </ButtonGroup>
          <ExportButtonGroup />
          <ButtonGroup>
            <Select defaultValue="hours">
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
              </SelectContent>
            </Select>
            <Input />
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="icon">
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <InputGroup>
                <InputGroupInput placeholder="Send a message..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupAddon align="inline-end">
                      <IconPlaceholder
                        lucide="AudioLinesIcon"
                        tabler="IconHeadphones"
                        hugeicons="AudioWave01Icon"
                      />
                    </InputGroupAddon>
                  </TooltipTrigger>
                  <TooltipContent>Voice Mode</TooltipContent>
                </Tooltip>
              </InputGroup>
            </ButtonGroup>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              <IconPlaceholder
                lucide="ArrowLeftIcon"
                tabler="IconArrowLeft"
                hugeicons="ArrowLeft01Icon"
                data-slot="icon-inline-start"
              />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button variant="outline" size="sm">
              5
            </Button>
            <Button variant="outline" size="sm">
              Next
              <IconPlaceholder
                lucide="ArrowRightIcon"
                tabler="IconArrowRight"
                hugeicons="ArrowRight01Icon"
                data-slot="icon-inline-end"
              />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                5
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="icon-xs">
                <IconPlaceholder
                  lucide="ArrowLeftIcon"
                  tabler="IconArrowLeft"
                  hugeicons="ArrowLeft01Icon"
                />
              </Button>
              <Button variant="outline" size="icon-xs">
                <IconPlaceholder
                  lucide="ArrowRightIcon"
                  tabler="IconArrowRight"
                  hugeicons="ArrowRight01Icon"
                />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">
                <IconPlaceholder
                  lucide="ArrowLeftIcon"
                  tabler="IconArrowLeft"
                  hugeicons="ArrowLeft01Icon"
                />
              </Button>
              <Button variant="outline">
                <IconPlaceholder
                  lucide="ArrowRightIcon"
                  tabler="IconArrowRight"
                  hugeicons="ArrowRight01Icon"
                />
              </Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Single navigation button">
              <Button variant="outline" size="icon">
                <IconPlaceholder
                  lucide="ArrowLeftIcon"
                  tabler="IconArrowLeft"
                  hugeicons="ArrowLeft01Icon"
                />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </div>
        <div className="flex max-w-xs flex-col gap-6">
          <Field>
            <Label id="alignment-label">Text Alignment</Label>
            <ButtonGroup aria-labelledby="alignment-label">
              <Button variant="outline" size="sm">
                Left
              </Button>
              <Button variant="outline" size="sm">
                Center
              </Button>
              <Button variant="outline" size="sm">
                Right
              </Button>
              <Button variant="outline" size="sm">
                Justify
              </Button>
            </ButtonGroup>
          </Field>
          <div className="flex gap-6">
            <ButtonGroup
              orientation="vertical"
              aria-label="Media controls"
              className="h-fit"
            >
              <Button variant="outline" size="icon">
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                />
              </Button>
              <Button variant="outline" size="icon">
                <IconPlaceholder
                  lucide="MinusIcon"
                  tabler="IconMinus"
                  hugeicons="MinusSignIcon"
                />
              </Button>
            </ButtonGroup>
            <ButtonGroup
              orientation="vertical"
              aria-label="Design tools palette"
            >
              <ButtonGroup orientation="vertical">
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="SearchIcon"
                    tabler="IconSearch"
                    hugeicons="Search01Icon"
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="ShareIcon"
                    tabler="IconShare"
                    hugeicons="Share03Icon"
                  />
                </Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical">
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="FlipHorizontalIcon"
                    tabler="IconFlipHorizontal"
                    hugeicons="FlipHorizontalIcon"
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="FlipVerticalIcon"
                    tabler="IconFlipVertical"
                    hugeicons="FlipVerticalIcon"
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="RotateCwIcon"
                    tabler="IconRotateClockwise2"
                    hugeicons="Rotate01Icon"
                  />
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="TrashIcon"
                    tabler="IconTrash"
                    hugeicons="Delete02Icon"
                  />
                </Button>
              </ButtonGroup>
            </ButtonGroup>
            <div className="flex flex-col gap-4">
              <ButtonGroup orientation="vertical">
                <Button variant="outline" size="sm">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                  />{" "}
                  Increase
                </Button>
                <Button variant="outline" size="sm">
                  <IconPlaceholder
                    lucide="MinusIcon"
                    tabler="IconMinus"
                    hugeicons="MinusSignIcon"
                  />{" "}
                  Decrease
                </Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical">
                <Button variant="secondary" size="sm">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                  />{" "}
                  Increase
                </Button>
                <ButtonGroupSeparator orientation="horizontal" />
                <Button variant="secondary" size="sm">
                  <IconPlaceholder
                    lucide="MinusIcon"
                    tabler="IconMinus"
                    hugeicons="MinusSignIcon"
                  />{" "}
                  Decrease
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExportButtonGroup() {
  const [exportType, setExportType] = useState("pdf")

  return (
    <ButtonGroup>
      <Input />
      <Select value={exportType} onValueChange={setExportType}>
        <SelectTrigger>
          <SelectValue asChild>
            <span>{exportType}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="pdf">pdf</SelectItem>
          <SelectItem value="xlsx">xlsx</SelectItem>
          <SelectItem value="csv">csv</SelectItem>
          <SelectItem value="json">json</SelectItem>
        </SelectContent>
      </Select>
    </ButtonGroup>
  )
}
