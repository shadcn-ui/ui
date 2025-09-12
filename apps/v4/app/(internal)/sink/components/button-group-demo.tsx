"use client"

import { useState } from "react"
import {
  IconArrowRight,
  IconBrandGithubCopilot,
  IconChevronDown,
  IconCloudCode,
  IconHeart,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  PercentIcon,
  RotateCwIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Field, FieldGroup } from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/registry/new-york-v4/ui/input-group"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/new-york-v4/ui/select"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export function ButtonGroupDemo() {
  const [currency, setCurrency] = useState("$")
  return (
    <div className="flex max-w-xs flex-col gap-6">
      <ButtonGroup>
        <Button>Button</Button>
        <Button>
          Get Started <IconArrowRight />
        </Button>
      </ButtonGroup>

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

      <div className="flex gap-4">
        <ButtonGroup>
          <Button variant="outline">Update</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ChevronDownIcon />
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
        <ButtonGroup className="[--radius:9999px]">
          <Button variant="outline">Follow</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="!pl-2">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="[--radius:0.95rem]">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <VolumeOffIcon />
                  Mute Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckIcon />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertTriangleIcon />
                  Report Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRoundXIcon />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShareIcon />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon />
                  Copy Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <TrashIcon />
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
            <SelectContent>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="€">€</SelectItem>
              <SelectItem value="£">£</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Enter amount to send" />
          <Button variant="outline">
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </Field>

      <ButtonGroup>
        <Button variant="outline">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>

      <ButtonGroup className="[--spacing:0.2rem]">
        <Button variant="outline">
          <FlipHorizontalIcon />
        </Button>
        <Button variant="outline">
          <FlipVerticalIcon />
        </Button>
        <Button variant="outline">
          <RotateCwIcon />
        </Button>
        <InputGroup>
          <Input placeholder="0.00" />
          <InputGroupAddon align="end" className="text-muted-foreground">
            <PercentIcon />
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>

      <div className="flex gap-2 [--radius:0.95rem] [--ring:var(--color-blue-300)] [--spacing:0.22rem] **:[.shadow-xs]:shadow-none">
        <InputGroup>
          <Input placeholder="Type to search..." />
          <InputGroupAddon className="text-muted-foreground">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroup>
          <Button variant="outline">
            <IconBrandGithubCopilot />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <IconCloudCode />
                <IconChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="rounded-xl p-0 text-sm">
              <div className="px-4 py-3">
                <div className="text-sm font-medium">Agent Tasks</div>
              </div>
              <Separator />
              <div className="p-4 *:[p:not(:last-child)]:mb-2">
                <Textarea
                  placeholder="Describe your task in natural language."
                  className="mb-4 resize-none"
                />
                <p className="font-medium">Start a new task with Copilot</p>
                <p className="text-muted-foreground">
                  Describe your task in natural language. Copilot will work in
                  the background and open a pull request for your review.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </ButtonGroup>
      </div>

      <FieldGroup className="grid grid-cols-2 gap-4 [--spacing:0.22rem]">
        <Field>
          <Label htmlFor="width">Width</Label>
          <ButtonGroup>
            <InputGroup>
              <InputGroupAddon className="text-muted-foreground">
                W
              </InputGroupAddon>
              <Input id="width" />
              <InputGroupAddon align="end" className="text-muted-foreground">
                px
              </InputGroupAddon>
            </InputGroup>
            <Button variant="outline" size="icon">
              <IconMinus />
            </Button>
            <Button variant="outline" size="icon">
              <IconPlus />
            </Button>
          </ButtonGroup>
        </Field>
        <Field className="w-full">
          <Label htmlFor="color">Color</Label>
          <ButtonGroup className="w-full">
            <InputGroup>
              <Input id="color" />
              <InputGroupAddon>
                <Popover>
                  <PopoverTrigger asChild>
                    <InputGroupButton>
                      <span className="size-4 rounded-xs bg-blue-600" />
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
                        "#EA4335", // Red
                        "#FBBC04", // Yellow
                        "#34A853", // Green
                        "#4285F4", // Blue
                        "#9333EA", // Purple
                        "#EC4899", // Pink
                        "#10B981", // Emerald
                        "#F97316", // Orange
                        "#6366F1", // Indigo
                        "#14B8A6", // Teal
                        "#8B5CF6", // Violet
                        "#F59E0B", // Amber
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
              <InputGroupAddon align="end" className="text-muted-foreground">
                %
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>
        </Field>
      </FieldGroup>

      <ButtonGroup>
        <Button variant="outline">
          <IconHeart /> Like
        </Button>
        <Button
          variant="outline"
          asChild
          className="text-muted-foreground pointer-events-none px-2"
        >
          <span>1.2K</span>
        </Button>
      </ButtonGroup>
    </div>
  )
}
