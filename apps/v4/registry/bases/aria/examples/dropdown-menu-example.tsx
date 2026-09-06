"use client"

import * as React from "react"
import type { Selection } from "react-aria-components"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/aria/ui/avatar"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
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
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function DropdownMenuExample() {
  return (
    <ExampleWrapper>
      <DropdownMenuBasic />
      <DropdownMenuComplex />
      <DropdownMenuSides />
      <DropdownMenuWithIcons />
      <DropdownMenuWithShortcuts />
      <DropdownMenuWithSubmenu />
      <DropdownMenuWithCheckboxes />
      <DropdownMenuWithCheckboxesIcons />
      <DropdownMenuWithRadio />
      <DropdownMenuWithRadioIcons />
      <DropdownMenuWithDestructive />
      <DropdownMenuWithAvatar />
      <DropdownMenuInDialog />
      <DropdownMenuWithInset />
    </ExampleWrapper>
  )
}

function DropdownMenuBasic() {
  return (
    <Example title="Basic">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Open
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem isDisabled>API</DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuSides() {
  return (
    <Example title="Sides" containerClassName="col-span-2">
      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { label: "start", placement: "start top" },
            { label: "left", placement: "left top" },
            { label: "top", placement: "top start" },
            { label: "bottom", placement: "bottom start" },
            { label: "right", placement: "right top" },
            { label: "end", placement: "end top" },
          ] as const
        ).map(({ label, placement }) => (
          <DropdownMenuTrigger key={placement}>
            <Button variant="outline" className="w-fit capitalize">
              {label}
            </Button>
            <DropdownMenu placement={placement}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
        ))}
      </div>
    </Example>
  )
}

function DropdownMenuWithIcons() {
  return (
    <Example title="With Icons">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Open
        </Button>
        <DropdownMenu>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="UserIcon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
            />
            Profile
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
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="SettingsIcon"
              phosphor="GearIcon"
              remixicon="RiSettingsLine"
            />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="LogOutIcon"
              tabler="IconLogout"
              hugeicons="LogoutIcon"
              phosphor="SignOutIcon"
              remixicon="RiLogoutBoxLine"
            />
            Log out
          </DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithShortcuts() {
  return (
    <Example title="With Shortcuts">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Open
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Keyboard shortcuts
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithSubmenu() {
  return (
    <Example title="With Submenu">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Open
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithCheckboxes() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["status-bar"])
  )

  return (
    <Example title="With Checkboxes">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Checkboxes
        </Button>
        <DropdownMenu className="min-w-40">
          <DropdownMenuGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuItem id="status-bar">
              <IconPlaceholder
                lucide="LayoutIcon"
                tabler="IconLayout"
                hugeicons="LayoutIcon"
                phosphor="LayoutIcon"
                remixicon="RiLayoutLine"
              />
              Status Bar
            </DropdownMenuItem>
            <DropdownMenuItem id="activity-bar" isDisabled>
              <IconPlaceholder
                lucide="ActivityIcon"
                tabler="IconActivity"
                hugeicons="ActivityIcon"
                phosphor="ActivityIcon"
                remixicon="RiPulseLine"
              />
              Activity Bar
            </DropdownMenuItem>
            <DropdownMenuItem id="panel">
              <IconPlaceholder
                lucide="PanelLeftIcon"
                tabler="IconLayoutSidebar"
                hugeicons="LayoutLeftIcon"
                phosphor="SidebarIcon"
                remixicon="RiSideBarLine"
              />
              Panel
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithRadio() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <Example title="With Radio Group">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Radio Group
        </Button>
        <DropdownMenu>
          <DropdownMenuGroup
            selectionMode="single"
            selectedKeys={[position]}
            onSelectionChange={(keys) =>
              setPosition(
                keys === "all"
                  ? "bottom"
                  : (keys.values().next().value as string)
              )
            }
          >
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuItem id="top">
              <IconPlaceholder
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUp01Icon"
                phosphor="ArrowUpIcon"
                remixicon="RiArrowUpLine"
              />
              Top
            </DropdownMenuItem>
            <DropdownMenuItem id="bottom">
              <IconPlaceholder
                lucide="ArrowDownIcon"
                tabler="IconArrowDown"
                hugeicons="ArrowDown01Icon"
                phosphor="ArrowDownIcon"
                remixicon="RiArrowDownLine"
              />
              Bottom
            </DropdownMenuItem>
            <DropdownMenuItem id="right" isDisabled>
              <IconPlaceholder
                lucide="ArrowRightIcon"
                tabler="IconArrowRight"
                hugeicons="ArrowRight01Icon"
                phosphor="ArrowRightIcon"
                remixicon="RiArrowRightLine"
              />
              Right
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithCheckboxesIcons() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["email", "push"])
  )

  return (
    <Example title="Checkboxes with Icons">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Notifications
        </Button>
        <DropdownMenu className="min-w-56">
          <DropdownMenuGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
            <DropdownMenuItem id="email">
              <IconPlaceholder
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="MailIcon"
                phosphor="EnvelopeIcon"
                remixicon="RiMailLine"
              />
              Email notifications
            </DropdownMenuItem>
            <DropdownMenuItem id="sms">
              <IconPlaceholder
                lucide="MessageSquareIcon"
                tabler="IconMessage"
                hugeicons="MessageIcon"
                phosphor="ChatCircleIcon"
                remixicon="RiChat1Line"
              />
              SMS notifications
            </DropdownMenuItem>
            <DropdownMenuItem id="push">
              <IconPlaceholder
                lucide="BellIcon"
                tabler="IconBell"
                hugeicons="NotificationIcon"
                phosphor="BellIcon"
                remixicon="RiNotificationLine"
              />
              Push notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithRadioIcons() {
  const [paymentMethod, setPaymentMethod] = React.useState("card")

  return (
    <Example title="Radio with Icons">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Payment Method
        </Button>
        <DropdownMenu className="min-w-56">
          <DropdownMenuGroup
            selectionMode="single"
            selectedKeys={[paymentMethod]}
            onSelectionChange={(keys) =>
              setPaymentMethod(
                keys === "all" ? "card" : (keys.values().next().value as string)
              )
            }
          >
            <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
            <DropdownMenuItem id="card">
              <IconPlaceholder
                lucide="CreditCardIcon"
                tabler="IconCreditCard"
                hugeicons="CreditCardIcon"
                phosphor="CreditCardIcon"
                remixicon="RiBankCardLine"
              />
              Credit Card
            </DropdownMenuItem>
            <DropdownMenuItem id="paypal">
              <IconPlaceholder
                lucide="WalletIcon"
                tabler="IconWallet"
                hugeicons="WalletIcon"
                phosphor="WalletIcon"
                remixicon="RiWalletLine"
              />
              PayPal
            </DropdownMenuItem>
            <DropdownMenuItem id="bank">
              <IconPlaceholder
                lucide="Building2Icon"
                tabler="IconBuildingBank"
                hugeicons="BankIcon"
                phosphor="BankIcon"
                remixicon="RiBankLine"
              />
              Bank Transfer
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithDestructive() {
  return (
    <Example title="With Destructive Items">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Actions
        </Button>
        <DropdownMenu>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="PencilIcon"
              tabler="IconPencil"
              hugeicons="EditIcon"
              phosphor="PencilIcon"
              remixicon="RiPencilLine"
            />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="ShareIcon"
              tabler="IconShare"
              hugeicons="ShareIcon"
              phosphor="ShareIcon"
              remixicon="RiShareLine"
            />
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="ArchiveIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="ArchiveIcon"
              remixicon="RiArchiveLine"
            />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="DeleteIcon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
            Delete
          </DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuWithAvatar() {
  const menuContent = (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="BadgeCheckIcon"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadgeIcon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
          />
          Account
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
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="BellIcon"
            tabler="IconBell"
            hugeicons="NotificationIcon"
            phosphor="BellIcon"
            remixicon="RiNotificationLine"
          />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <IconPlaceholder
          lucide="LogOutIcon"
          tabler="IconLogout"
          hugeicons="LogoutIcon"
          phosphor="SignOutIcon"
          remixicon="RiLogoutBoxLine"
        />
        Sign Out
      </DropdownMenuItem>
    </>
  )

  return (
    <Example title="With Avatar">
      <div className="flex items-center justify-between gap-4">
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            className="h-12 justify-start px-2 md:max-w-[200px] style-sera:font-normal style-sera:tracking-normal style-sera:normal-case"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">shadcn</span>
              <span className="truncate text-xs text-muted-foreground">
                shadcn@example.com
              </span>
            </div>
            <IconPlaceholder
              lucide="ChevronsUpDownIcon"
              tabler="IconSelector"
              hugeicons="UnfoldMoreIcon"
              phosphor="CaretUpDownIcon"
              remixicon="RiArrowUpDownLine"
              className="ml-auto text-muted-foreground"
            />
          </Button>
          <DropdownMenu className="w-(--anchor-width) min-w-56">
            {menuContent}
          </DropdownMenu>
        </DropdownMenuTrigger>

        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
          </Button>
          <DropdownMenu placement="top end">{menuContent}</DropdownMenu>
        </DropdownMenuTrigger>
      </div>
    </Example>
  )
}

function DropdownMenuInDialog() {
  return (
    <Example title="In Dialog">
      <DialogTrigger>
        <Button variant="outline">Open Dialog</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Dropdown Menu Example</DialogTitle>
            <DialogDescription>
              Click the button below to see the dropdown menu.
            </DialogDescription>
          </DialogHeader>

          <DropdownMenuTrigger>
            <Button variant="outline" className="w-fit">
              Open Menu
            </Button>
            <DropdownMenu>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CopyIcon"
                  tabler="IconCopy"
                  hugeicons="CopyIcon"
                  phosphor="CopyIcon"
                  remixicon="RiFileCopyLine"
                />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ScissorsIcon"
                  tabler="IconCut"
                  hugeicons="ScissorIcon"
                  phosphor="ScissorsIcon"
                  remixicon="RiScissorsLine"
                />
                Cut
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ClipboardPasteIcon"
                  tabler="IconClipboard"
                  hugeicons="ClipboardIcon"
                  phosphor="ClipboardIcon"
                  remixicon="RiClipboardLine"
                />
                Paste
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <DropdownMenuItem>Save Page...</DropdownMenuItem>
                  <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
                  <DropdownMenuItem>Name Window...</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Developer Tools</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconPlaceholder
                  lucide="TrashIcon"
                  tabler="IconTrash"
                  hugeicons="DeleteIcon"
                  phosphor="TrashIcon"
                  remixicon="RiDeleteBinLine"
                />
                Delete
              </DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuTrigger>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}

function DropdownMenuWithInset() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["bookmarks"])
  )
  const [theme, setTheme] = React.useState("system")

  return (
    <Example title="With Inset">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Open
        </Button>
        <DropdownMenu className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="ScissorsIcon"
                tabler="IconCut"
                hugeicons="ScissorIcon"
                phosphor="ScissorsIcon"
                remixicon="RiScissorsLine"
              />
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem inset>Paste</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownMenuLabel inset>Appearance</DropdownMenuLabel>
            <DropdownMenuItem inset id="bookmarks">
              Bookmarks
            </DropdownMenuItem>
            <DropdownMenuItem inset id="urls">
              Full URLs
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
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
            <DropdownMenuLabel inset>Theme</DropdownMenuLabel>
            <DropdownMenuItem inset id="light">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem inset id="dark">
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem inset id="system">
              System
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset>More Options</DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Save Page...</DropdownMenuItem>
                <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </Example>
  )
}

function DropdownMenuComplex() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["sidebar"])
  )

  return (
    <Example title="Complex">
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit">
          Complex Menu
        </Button>
        <DropdownMenu className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="SettingsIcon"
                tabler="IconSettings"
                hugeicons="SettingsIcon"
                phosphor="GearIcon"
                remixicon="RiSettingsLine"
              />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownMenuLabel>View</DropdownMenuLabel>
            <DropdownMenuItem id="sidebar">
              <IconPlaceholder
                lucide="PanelLeftIcon"
                tabler="IconLayoutSidebar"
                hugeicons="LayoutLeftIcon"
                phosphor="SidebarIcon"
                remixicon="RiSideBarLine"
              />
              Sidebar
            </DropdownMenuItem>
            <DropdownMenuItem id="status-bar">
              <IconPlaceholder
                lucide="LayoutIcon"
                tabler="IconLayout"
                hugeicons="LayoutIcon"
                phosphor="LayoutIcon"
                remixicon="RiLayoutLine"
              />
              Status Bar
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconPlaceholder
                  lucide="UsersIcon"
                  tabler="IconUsers"
                  hugeicons="UserGroupIcon"
                  phosphor="UsersIcon"
                  remixicon="RiTeamLine"
                />
                Invite Users
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="MailIcon"
                      tabler="IconMail"
                      hugeicons="MailIcon"
                      phosphor="EnvelopeIcon"
                      remixicon="RiMailLine"
                    />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="MessageSquareIcon"
                      tabler="IconMessage"
                      hugeicons="MessageIcon"
                      phosphor="ChatCircleIcon"
                      remixicon="RiChat1Line"
                    />
                    Message
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="PlusCircleIcon"
                      tabler="IconCirclePlus"
                      hugeicons="AddCircleIcon"
                      phosphor="PlusCircleIcon"
                      remixicon="RiAddCircleLine"
                    />
                    More...
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
              Support
            </DropdownMenuItem>
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
    </Example>
  )
}
