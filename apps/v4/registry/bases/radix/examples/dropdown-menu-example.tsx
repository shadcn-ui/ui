"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/radix/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function DropdownMenuExample() {
  return (
    <ExampleWrapper>
      <DropdownMenuBasic />
      <DropdownMenuComplex />
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
    </ExampleWrapper>
  )
}

function DropdownMenuBasic() {
  return (
    <Example title="Basic">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithIcons() {
  return (
    <Example title="With Icons">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
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
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithShortcuts() {
  return (
    <Example title="With Shortcuts">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithSubmenu() {
  return (
    <Example title="With Submenu">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showActivityBar, setShowActivityBar] = React.useState(false)
  const [showPanel, setShowPanel] = React.useState(false)

  return (
    <Example title="With Checkboxes">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Checkboxes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              <IconPlaceholder
                lucide="LayoutIcon"
                tabler="IconLayout"
                hugeicons="LayoutIcon"
                phosphor="LayoutIcon"
                remixicon="RiLayoutLine"
              />
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
              disabled
            >
              <IconPlaceholder
                lucide="ActivityIcon"
                tabler="IconActivity"
                hugeicons="ActivityIcon"
                phosphor="ActivityIcon"
                remixicon="RiPulseLine"
              />
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              <IconPlaceholder
                lucide="PanelLeftIcon"
                tabler="IconLayoutSidebar"
                hugeicons="LayoutLeftIcon"
                phosphor="SidebarIcon"
                remixicon="RiSideBarLine"
              />
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithRadio() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <Example title="With Radio Group">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Radio Group
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">
                <IconPlaceholder
                  lucide="ArrowUpIcon"
                  tabler="IconArrowUp"
                  hugeicons="ArrowUp01Icon"
                  phosphor="ArrowUpIcon"
                  remixicon="RiArrowUpLine"
                />
                Top
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <IconPlaceholder
                  lucide="ArrowDownIcon"
                  tabler="IconArrowDown"
                  hugeicons="ArrowDown01Icon"
                  phosphor="ArrowDownIcon"
                  remixicon="RiArrowDownLine"
                />
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right" disabled>
                <IconPlaceholder
                  lucide="ArrowRightIcon"
                  tabler="IconArrowRight"
                  hugeicons="ArrowRight01Icon"
                  phosphor="ArrowRightIcon"
                  remixicon="RiArrowRightLine"
                />
                Right
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithCheckboxesIcons() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })

  return (
    <Example title="Checkboxes with Icons">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Notifications
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked === true })
              }
            >
              <IconPlaceholder
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="MailIcon"
                phosphor="EnvelopeIcon"
                remixicon="RiMailLine"
              />
              Email notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sms: checked === true })
              }
            >
              <IconPlaceholder
                lucide="MessageSquareIcon"
                tabler="IconMessage"
                hugeicons="MessageIcon"
                phosphor="ChatCircleIcon"
                remixicon="RiChat1Line"
              />
              SMS notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked === true })
              }
            >
              <IconPlaceholder
                lucide="BellIcon"
                tabler="IconBell"
                hugeicons="NotificationIcon"
                phosphor="BellIcon"
                remixicon="RiNotificationLine"
              />
              Push notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithRadioIcons() {
  const [paymentMethod, setPaymentMethod] = React.useState("card")

  return (
    <Example title="Radio with Icons">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Payment Method</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <DropdownMenuRadioItem value="card">
                <IconPlaceholder
                  lucide="CreditCardIcon"
                  tabler="IconCreditCard"
                  hugeicons="CreditCardIcon"
                  phosphor="CreditCardIcon"
                  remixicon="RiBankCardLine"
                />
                Credit Card
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="paypal">
                <IconPlaceholder
                  lucide="WalletIcon"
                  tabler="IconWallet"
                  hugeicons="WalletIcon"
                  phosphor="WalletIcon"
                  remixicon="RiWalletLine"
                />
                PayPal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bank">
                <IconPlaceholder
                  lucide="Building2Icon"
                  tabler="IconBuildingBank"
                  hugeicons="BankIcon"
                  phosphor="BankIcon"
                  remixicon="RiBankLine"
                />
                Bank Transfer
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function DropdownMenuWithDestructive() {
  return (
    <Example title="With Destructive Items">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
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
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
      <DropdownMenuGroup>
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
      </DropdownMenuGroup>
    </>
  )

  return (
    <Example title="With Avatar">
      <div className="flex items-center justify-between gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 justify-start px-2 md:max-w-[200px]"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">shadcn</span>
                <span className="text-muted-foreground truncate text-xs">
                  shadcn@example.com
                </span>
              </div>
              <IconPlaceholder
                lucide="ChevronsUpDownIcon"
                tabler="IconSelector"
                hugeicons="UnfoldMoreIcon"
                phosphor="CaretUpDownIcon"
                remixicon="RiArrowUpDownLine"
                className="text-muted-foreground ml-auto"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Example>
  )
}

function DropdownMenuInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dropdown Menu Example</DialogTitle>
            <DialogDescription>
              Click the button below to see the dropdown menu.
            </DialogDescription>
          </DialogHeader>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-fit">
                Open Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
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
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Save Page...</DropdownMenuItem>
                      <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
                      <DropdownMenuItem>Name Window...</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Developer Tools</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function DropdownMenuComplex() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Complex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Complex Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="style-maia:w-56 style-mira:w-48 style-nova:w-48 style-vega:w-56 style-lyra:w-48">
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
              <DropdownMenuPortal>
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
                      <DropdownMenuPortal>
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
                      </DropdownMenuPortal>
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
              </DropdownMenuPortal>
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>View</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked === true })
              }
            >
              <IconPlaceholder
                lucide="EyeIcon"
                tabler="IconEye"
                hugeicons="EyeIcon"
                phosphor="EyeIcon"
                remixicon="RiEyeLine"
              />
              Show Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sms: checked === true })
              }
            >
              <IconPlaceholder
                lucide="LayoutIcon"
                tabler="IconLayout"
                hugeicons="LayoutIcon"
                phosphor="LayoutIcon"
                remixicon="RiLayoutLine"
              />
              Show Status Bar
            </DropdownMenuCheckboxItem>
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
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={setTheme}
                    >
                      <DropdownMenuRadioItem value="light">
                        <IconPlaceholder
                          lucide="SunIcon"
                          tabler="IconSun"
                          hugeicons="SunIcon"
                          phosphor="SunIcon"
                          remixicon="RiSunLine"
                        />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <IconPlaceholder
                          lucide="MoonIcon"
                          tabler="IconMoon"
                          hugeicons="MoonIcon"
                          phosphor="MoonIcon"
                          remixicon="RiMoonLine"
                        />
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system">
                        <IconPlaceholder
                          lucide="MonitorIcon"
                          tabler="IconDeviceDesktop"
                          hugeicons="ComputerIcon"
                          phosphor="MonitorIcon"
                          remixicon="RiComputerLine"
                        />
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
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
              <DropdownMenuPortal>
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
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>
                              Notification Types
                            </DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                              checked={notifications.push}
                              onCheckedChange={(checked) =>
                                setNotifications({
                                  ...notifications,
                                  push: checked === true,
                                })
                              }
                            >
                              <IconPlaceholder
                                lucide="BellIcon"
                                tabler="IconBell"
                                hugeicons="NotificationIcon"
                                phosphor="BellIcon"
                                remixicon="RiNotificationLine"
                              />
                              Push Notifications
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                              checked={notifications.email}
                              onCheckedChange={(checked) =>
                                setNotifications({
                                  ...notifications,
                                  email: checked === true,
                                })
                              }
                            >
                              <IconPlaceholder
                                lucide="MailIcon"
                                tabler="IconMail"
                                hugeicons="MailIcon"
                                phosphor="EnvelopeIcon"
                                remixicon="RiMailLine"
                              />
                              Email Notifications
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
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
              </DropdownMenuPortal>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}
