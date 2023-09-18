"use client"

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/registry/tui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/tui/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Icon, IconType } from "../../ui/icon"



interface DropdownItem {
  icon?: IconType;
  title: string;
  shortcut: string;
  children?: DropdownItem[]; // Recursively define the structure for children
  isLabel?: boolean;
  isSeparator?: boolean;
}
// icon, title, shortcut

const dropDownData: DropdownItem[] = [
  {
    title: 'My Account',
    shortcut: '',
    isLabel: true,
    isSeparator: false
  },
  {
    title: '',
    shortcut: '',
    isLabel: false,
    isSeparator: true
  },
  {
    icon: "user-solid",
    title: 'Profile',
    shortcut: '⇧⌘P',
  },
  {
    icon: "credit-card-solid",
    title: 'Billing',
    shortcut: '⌘B',
  },
  {
    icon: "gear-solid",
    title: 'Settings',
    shortcut: '⌘S',
  },
  {
    icon: "keyboard-solid",
    title: 'Keyboard shortcuts',
    shortcut: '⌘K',
  },
  {
    title: '',
    shortcut: '',
    isSeparator: true
  },
  {
    icon: "users-solid",
    title: 'Team',
    shortcut: '',
  },
  {
    icon: "user-plus-solid",
    title: 'Invite users',
    shortcut: '',
    children: [
      {
        icon: "envelope-solid",
        title: 'Email',
        shortcut: '',
      },
      {
        icon: "message-solid",
        title: 'Message',
        shortcut: '',
      },
      {
        icon: "circle-plus-solid",
        title: 'More...',
        shortcut: '',
      },
    ]
  },
  {
    title: '',
    shortcut: '',
    isSeparator: true
  },
  {
    icon: "plus-solid",
    title: 'New Team',
    shortcut: '',
  },
  {
    icon: "github-solid",
    title: 'GitHub',
    shortcut: '',
  },
  {
    icon: "life-ring-solid",
    title: 'Support',
    shortcut: '',
  },
  {
    icon: "cloud-solid",
    title: 'API',
    shortcut: '',
  },
  {
    title: '',
    shortcut: '',
    isSeparator: true
  },
  {
    icon: "arrow-right-from-bracket-solid",
    title: 'Logout',
    shortcut: '⇧⌘Q',
  }
]

export function DropdownMenuCard() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Dropdown Menu Variants</CardTitle>
        <CardDescription>
          List of possible variants of Dropdown Menu
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <CardDescription>
          1. With Icons, Dividers and Sub Menu
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <>
                    {
                      data.isLabel ? <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        :
                        data?.children?.length! > 0 ?
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map((child: DropdownItem, idx: number) => {
                                  return (
                                    <DropdownMenuItem key={idx}>
                                      {child?.icon && <Icon name={child?.icon!} className="mr-2 h-4 w-4" />}
                                      <span>{child.title}</span>
                                      <DropdownMenuShortcut>{child?.shortcut}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          :
                          data.isSeparator ? <DropdownMenuSeparator /> :
                            <DropdownMenuItem>
                              {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                              <span>{data.title}</span>
                              <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                    }
                  </>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          2. Without Icons & Dividers
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <>
                    {
                      data.isLabel ? <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        :
                        data?.children?.length! > 0 ?
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map((child: DropdownItem, idx: number) => {
                                  return (
                                    <DropdownMenuItem key={idx}>
                                      <span>{child.title}</span>
                                      <DropdownMenuShortcut>{child?.shortcut}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          :
                          <DropdownMenuItem>
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                    }
                  </>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          3. With Dividers
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <>
                    {
                      data.isLabel ? <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        :
                        data?.children?.length! > 0 ?
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map((child: DropdownItem, idx: number) => {
                                  return (
                                    <DropdownMenuItem key={idx}>
                                      <span>{child.title}</span>
                                      <DropdownMenuShortcut>{child?.shortcut}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          :
                          data.isSeparator ? <DropdownMenuSeparator /> :
                            <DropdownMenuItem>
                              <span>{data.title}</span>
                              <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                    }
                  </>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          4. With Icons
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <>
                    {
                      data.isLabel ? <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        :
                        data?.children?.length! > 0 ?
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map((child: DropdownItem, idx: number) => {
                                  return (
                                    <DropdownMenuItem key={idx}>
                                      {child?.icon && <Icon name={child?.icon!} className="mr-2 h-4 w-4" />}
                                      <span>{child.title}</span>
                                      <DropdownMenuShortcut>{child?.shortcut}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          :
                          <DropdownMenuItem>
                            {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                    }
                  </>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          5. With minimal menu icon
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center" >
              <Icon name={'ellipsis-solid'} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <>
                    {
                      data.isLabel ? <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        :
                        data?.children?.length! > 0 ?
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map((child: DropdownItem, idx: number) => {
                                  return (
                                    <DropdownMenuItem key={idx}>
                                      {child?.icon && <Icon name={child?.icon!} className="mr-2 h-4 w-4" />}
                                      <span>{child.title}</span>
                                      <DropdownMenuShortcut>{child?.shortcut}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          :
                          <DropdownMenuItem>
                            {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                    }
                  </>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
