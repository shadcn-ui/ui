"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/aria/ui/alert-dialog"
import { Badge } from "@/registry/bases/aria/ui/badge"
import { Button } from "@/registry/bases/aria/ui/button"
import { ButtonGroup } from "@/registry/bases/aria/ui/button-group"
import { Card, CardContent } from "@/registry/bases/aria/ui/card"
import { Checkbox } from "@/registry/bases/aria/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/aria/ui/dropdown-menu"
import { Field, FieldGroup } from "@/registry/bases/aria/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/aria/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/aria/ui/item"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/aria/ui/radio-group"
import { Slider } from "@/registry/bases/aria/ui/slider"
import { Switch } from "@/registry/bases/aria/ui/switch"
import { Textarea } from "@/registry/bases/aria/ui/textarea"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function UIElements() {
  const [sliderValue, setSliderValue] = React.useState<number[]>([500])
  const handleSliderValueChange = React.useCallback(
    (value: number | readonly number[]) => {
      if (typeof value === "number") {
        setSliderValue([value])
      } else {
        setSliderValue([...value])
      }
    },
    []
  )

  return (
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
          onChange={handleSliderValueChange}
          maxValue={1000}
          minValue={0}
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
          <RadioGroup defaultValue="apple" className="ml-auto flex w-fit gap-3">
            <RadioGroupItem value="apple" />
            <RadioGroupItem value="banana" />
          </RadioGroup>
          <div className="flex gap-3">
            <Checkbox defaultSelected />
            <Checkbox />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AlertDialogTrigger>
            <Button variant="outline">
              <span className="hidden md:flex style-sera:md:hidden">
                Alert Dialog
              </span>
              <span className="flex md:hidden style-sera:md:flex">Dialog</span>
            </Button>
            <AlertDialog size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device and your data?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialog>
          </AlertDialogTrigger>
          <ButtonGroup>
            <Button variant="outline">
              <span className="style-sera:hidden">Button Group</span>
              <span className="hidden style-sera:block">Group</span>
            </Button>

            <DropdownMenuTrigger>
              <Button variant="outline" size="icon">
                <IconPlaceholder
                  lucide="ChevronUpIcon"
                  tabler="IconChevronUp"
                  hugeicons="ArrowUp01Icon"
                  phosphor="CaretUpIcon"
                  remixicon="RiArrowUpSLine"
                />
              </Button>
              <DropdownMenu placement="top end" className="w-fit">
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
              </DropdownMenu>
            </DropdownMenuTrigger>
          </ButtonGroup>
          <Switch defaultSelected className="ml-auto" />
        </div>
      </CardContent>
    </Card>
  )
}
