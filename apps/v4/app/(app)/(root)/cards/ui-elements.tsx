"use client"

import {
  ArrowRight02Icon,
  ArrowUp01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
} from "@/styles/base-force-ui/ui/alert-dialog"
import { Badge } from "@/styles/base-force-ui/ui/badge"
import { Button } from "@/styles/base-force-ui/ui/button"
import { ButtonGroup } from "@/styles/base-force-ui/ui/button-group"
import { Card, CardContent } from "@/styles/base-force-ui/ui/card"
import { Checkbox } from "@/styles/base-force-ui/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/base-force-ui/ui/dropdown-menu"
import { Field, FieldGroup } from "@/styles/base-force-ui/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/styles/base-force-ui/ui/input-group"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/styles/base-force-ui/ui/radio-group"
import { Switch } from "@/styles/base-force-ui/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/base-force-ui/ui/tabs"
import { Textarea } from "@/styles/base-force-ui/ui/textarea"

export function UIElements() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-6">
        <div className="flex gap-2">
          <Button>
            Button{" "}
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              strokeWidth={2}
              data-icon="inline-end"
            />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <FieldGroup>
          <Field>
            <InputGroup>
              <InputGroupInput placeholder="Name" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
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
            <Badge variant="outline" className="hidden 4xl:flex">
              Outline
            </Badge>
          </div>
          <RadioGroup
            defaultValue="apple"
            className="ml-auto flex w-fit gap-3"
            aria-label="Fruit preference"
          >
            <RadioGroupItem value="apple" aria-label="Apple" />
            <RadioGroupItem value="banana" aria-label="Banana" />
          </RadioGroup>
          <div className="flex gap-3">
            <Checkbox defaultChecked aria-label="Enable email alerts" />
            <Checkbox
              className="hidden 4xl:flex"
              aria-label="Enable push alerts"
            />
          </div>
          <Switch
            defaultChecked
            className="flex 4xl:hidden"
            aria-label="Enable compact notifications"
          />
        </div>
        <div className="flex items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              <span className="style-sera:md:hidden hidden md:flex">
                Alert Dialog
              </span>
              <span className="style-sera:md:flex flex md:hidden">Dialog</span>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm" className="theme-blue">
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
            </AlertDialogContent>
          </AlertDialog>
          <ButtonGroup className="ml-auto">
            <Button variant="outline">
              <span className="style-sera:hidden">Button Group</span>
              <span className="style-sera:block hidden">Group</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open quick actions"
                  />
                }
              >
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                  <DropdownMenuItem>Block User</DropdownMenuItem>
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
          <Switch
            defaultChecked
            className="hidden 4xl:flex"
            aria-label="Enable advanced setting"
          />
        </div>
      </CardContent>
    </Card>
  )
}
