"use client"

import * as React from "react"
import type { Selection } from "react-aria-components"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/aria/ui/alert-dialog"
import { Badge } from "@/registry/bases/aria/ui/badge"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/aria/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/aria/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { Textarea } from "@/registry/bases/aria/ui/textarea"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <CardExample />
      <FormExample />
    </ExampleWrapper>
  )
}

function CardExample() {
  return (
    <Example title="Card" className="items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color" />
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
          <AlertDialogTrigger>
            <Button>
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                data-icon="inline-start"
              />
              Show Dialog
            </Button>
            <AlertDialog size="sm">
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
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialog>
          </AlertDialogTrigger>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const roleItems = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "Other", value: "other" },
]

function FormExample() {
  const [notifications, setNotifications] = React.useState<Selection>(
    new Set(["email", "push"])
  )
  const [view, setView] = React.useState<Selection>(new Set(["sidebar"]))
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
          <CardAction>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <IconPlaceholder
                  lucide="MoreVerticalIcon"
                  tabler="IconDotsVertical"
                  hugeicons="MoreVerticalCircle01Icon"
                  phosphor="DotsThreeVerticalIcon"
                  remixicon="RiMore2Line"
                />
                <span className="sr-only">More options</span>
              </Button>
              <DropdownMenu placement="bottom end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FileIcon"
                      tabler="IconFile"
                      hugeicons="FileIcon"
                      phosphor="FileIcon"
                      remixicon="RiFileLine"
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FolderIcon"
                      tabler="IconFolder"
                      hugeicons="FolderIcon"
                      phosphor="FolderIcon"
                      remixicon="RiFolderLine"
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="FolderOpenIcon"
                        tabler="IconFolderOpen"
                        hugeicons="FolderOpenIcon"
                        phosphor="FolderOpenIcon"
                        remixicon="RiFolderOpenLine"
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <IconPlaceholder
                            lucide="FileCodeIcon"
                            tabler="IconFileCode"
                            hugeicons="CodeIcon"
                            phosphor="CodeIcon"
                            remixicon="RiCodeLine"
                          />
                          Project Alpha
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconPlaceholder
                            lucide="FileCodeIcon"
                            tabler="IconFileCode"
                            hugeicons="CodeIcon"
                            phosphor="CodeIcon"
                            remixicon="RiCodeLine"
                          />
                          Project Beta
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <IconPlaceholder
                              lucide="MoreHorizontalIcon"
                              tabler="IconDots"
                              hugeicons="MoreHorizontalCircle01Icon"
                              phosphor="DotsThreeOutlineIcon"
                              remixicon="RiMoreLine"
                            />
                            More Projects
                          </DropdownMenuSubTrigger>

                          <DropdownMenuSubContent>
                            <DropdownMenuItem>
                              <IconPlaceholder
                                lucide="FileCodeIcon"
                                tabler="IconFileCode"
                                hugeicons="CodeIcon"
                                phosphor="CodeIcon"
                                remixicon="RiCodeLine"
                              />
                              Project Gamma
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconPlaceholder
                                lucide="FileCodeIcon"
                                tabler="IconFileCode"
                                hugeicons="CodeIcon"
                                phosphor="CodeIcon"
                                remixicon="RiCodeLine"
                              />
                              Project Delta
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <IconPlaceholder
                            lucide="FolderSearchIcon"
                            tabler="IconFolderSearch"
                            hugeicons="SearchIcon"
                            phosphor="MagnifyingGlassIcon"
                            remixicon="RiSearchLine"
                          />
                          Browse...
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="SaveIcon"
                      tabler="IconDeviceFloppy"
                      hugeicons="FloppyDiskIcon"
                      phosphor="FloppyDiskIcon"
                      remixicon="RiSaveLine"
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="DownloadIcon"
                      tabler="IconDownload"
                      hugeicons="DownloadIcon"
                      phosphor="DownloadIcon"
                      remixicon="RiDownloadLine"
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup
                  selectionMode="multiple"
                  selectedKeys={notifications}
                  onSelectionChange={setNotifications}
                >
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuItem id="sidebar">
                    <IconPlaceholder
                      lucide="EyeIcon"
                      tabler="IconEye"
                      hugeicons="EyeIcon"
                      phosphor="EyeIcon"
                      remixicon="RiEyeLine"
                    />
                    Show Sidebar
                  </DropdownMenuItem>
                  <DropdownMenuItem id="status-bar">
                    <IconPlaceholder
                      lucide="LayoutIcon"
                      tabler="IconLayout"
                      hugeicons="LayoutIcon"
                      phosphor="LayoutIcon"
                      remixicon="RiLayoutLine"
                    />
                    Show Status Bar
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="PaletteIcon"
                        tabler="IconPalette"
                        hugeicons="PaintBoardIcon"
                        phosphor="PaletteIcon"
                        remixicon="RiPaletteLine"
                      />
                      Theme
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                      <DropdownMenuGroup
                        selectionMode="single"
                        selectedKeys={[theme]}
                        onSelectionChange={(keys) =>
                          setTheme(
                            keys === "all"
                              ? "system"
                              : (keys.values().next().value as string)
                          )
                        }
                      >
                        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                        <DropdownMenuItem id="light">
                          <IconPlaceholder
                            lucide="SunIcon"
                            tabler="IconSun"
                            hugeicons="SunIcon"
                            phosphor="SunIcon"
                            remixicon="RiSunLine"
                          />
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem id="dark">
                          <IconPlaceholder
                            lucide="MoonIcon"
                            tabler="IconMoon"
                            hugeicons="MoonIcon"
                            phosphor="MoonIcon"
                            remixicon="RiMoonLine"
                          />
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem id="system">
                          <IconPlaceholder
                            lucide="MonitorIcon"
                            tabler="IconDeviceDesktop"
                            hugeicons="ComputerIcon"
                            phosphor="MonitorIcon"
                            remixicon="RiComputerLine"
                          />
                          System
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="UserIcon"
                      tabler="IconUser"
                      hugeicons="UserIcon"
                      phosphor="UserIcon"
                      remixicon="RiUserLine"
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="CreditCardIcon"
                      tabler="IconCreditCard"
                      hugeicons="CreditCardIcon"
                      phosphor="CreditCardIcon"
                      remixicon="RiBankCardLine"
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="SettingsIcon"
                        tabler="IconSettings"
                        hugeicons="SettingsIcon"
                        phosphor="GearIcon"
                        remixicon="RiSettingsLine"
                      />
                      Settings
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <IconPlaceholder
                            lucide="KeyboardIcon"
                            tabler="IconKeyboard"
                            hugeicons="KeyboardIcon"
                            phosphor="KeyboardIcon"
                            remixicon="RiKeyboardLine"
                          />
                          Keyboard Shortcuts
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconPlaceholder
                            lucide="LanguagesIcon"
                            tabler="IconLanguage"
                            hugeicons="LanguageCircleIcon"
                            phosphor="TranslateIcon"
                            remixicon="RiTranslate"
                          />
                          Language
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <IconPlaceholder
                              lucide="BellIcon"
                              tabler="IconBell"
                              hugeicons="NotificationIcon"
                              phosphor="BellIcon"
                              remixicon="RiNotificationLine"
                            />
                            Notifications
                          </DropdownMenuSubTrigger>

                          <DropdownMenuSubContent>
                            <DropdownMenuGroup
                              selectionMode="multiple"
                              selectedKeys={notifications}
                              onSelectionChange={setNotifications}
                            >
                              <DropdownMenuLabel>
                                Notification Types
                              </DropdownMenuLabel>
                              <DropdownMenuItem id="push">
                                <IconPlaceholder
                                  lucide="BellIcon"
                                  tabler="IconBell"
                                  hugeicons="NotificationIcon"
                                  phosphor="BellIcon"
                                  remixicon="RiNotificationLine"
                                />
                                Push Notifications
                              </DropdownMenuItem>
                              <DropdownMenuItem id="email">
                                <IconPlaceholder
                                  lucide="MailIcon"
                                  tabler="IconMail"
                                  hugeicons="MailIcon"
                                  phosphor="EnvelopeIcon"
                                  remixicon="RiMailLine"
                                />
                                Email Notifications
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <IconPlaceholder
                            lucide="ShieldIcon"
                            tabler="IconShield"
                            hugeicons="ShieldIcon"
                            phosphor="ShieldIcon"
                            remixicon="RiShieldLine"
                          />
                          Privacy & Security
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="HelpCircleIcon"
                      tabler="IconHelpCircle"
                      hugeicons="HelpCircleIcon"
                      phosphor="QuestionIcon"
                      remixicon="RiQuestionLine"
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FileTextIcon"
                      tabler="IconFileText"
                      hugeicons="File01Icon"
                      phosphor="FileTextIcon"
                      remixicon="RiFileTextLine"
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <IconPlaceholder
                      lucide="LogOutIcon"
                      tabler="IconLogout"
                      hugeicons="LogoutIcon"
                      phosphor="SignOutIcon"
                      remixicon="RiLogoutBoxLine"
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenu>
            </DropdownMenuTrigger>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="Enter your name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                  <Select defaultValue={null}>
                    <SelectTrigger id="small-form-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleItems.map((item) => (
                          <SelectItem key={item.value} id={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="small-form-framework">
                  Framework
                </FieldLabel>
                <Combobox allowsEmptyCollection>
                  <ComboboxInput
                    id="small-form-framework"
                    placeholder="Select a framework"
                    required
                  />
                  <ComboboxContent>
                    <ComboboxList
                      renderEmptyState={() => (
                        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                      )}
                    >
                      {frameworks.map((item) => (
                        <ComboboxItem key={item} id={item}>
                          {item}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
                <Textarea
                  id="small-form-comments"
                  placeholder="Add any additional comments"
                />
              </Field>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}
