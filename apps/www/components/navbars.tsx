import React from "react"

import { Avatar } from "@/registry/tui/ui/avatar"
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
import { Icon, IconType } from "@/registry/tui/ui/icon"
import { Input } from "@/registry/tui/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/registry/tui/ui/tabs"

import { TabsInPills } from "./tabsCard"
import { Card, CardContent } from "@/registry/tui/ui/card"
import Image from "next/image"

interface DropdownItem {
  icon?: IconType
  title: string
  shortcut?: string
  children?: DropdownItem[]
  isLabel?: boolean
  isSeparator?: boolean
  isDisabled?: boolean
  isCheckBox?: boolean
  isRadio?: boolean
}

const dropDownData: DropdownItem[] = [
  {
    title: "My Account",
    shortcut: "",
    isLabel: true,
    isSeparator: false,
  },
  {
    title: "",
    shortcut: "",
    isLabel: false,
    isSeparator: true,
  },
  {
    icon: "user-solid",
    title: "Profile",
    shortcut: "⇧⌘P",
  },
  {
    icon: "credit-card-solid",
    title: "Billing",
    shortcut: "⌘B",
  },
  {
    icon: "gear-solid",
    title: "Settings",
    shortcut: "⌘S",
  },
  {
    icon: "keyboard-solid",
    title: "Keyboard shortcuts",
    shortcut: "⌘K",
  },
  {
    title: "",
    shortcut: "",
    isSeparator: true,
  },
  {
    icon: "users-solid",
    title: "Team",
    shortcut: "",
  },
  {
    icon: "megaphone-solid",
    title: "Announcements",
    isCheckBox: true,
  },
  {
    icon: "user-plus-solid",
    title: "Invite users",
    shortcut: "",
    children: [
      {
        icon: "envelope-solid",
        title: "Email",
        shortcut: "",
      },
      {
        icon: "message-solid",
        title: "Message",
        shortcut: "",
      },
      {
        icon: "circle-plus-solid",
        title: "More...",
        shortcut: "",
      },
    ],
  },
  {
    title: "",
    shortcut: "",
    isSeparator: true,
  },
  {
    icon: "plus-solid",
    title: "New Team",
    shortcut: "",
  },
  {
    icon: "github-solid",
    title: "GitHub",
    shortcut: "",
  },
  {
    icon: "life-ring-solid",
    title: "Support",
    shortcut: "",
  },
  {
    icon: "cloud-solid",
    title: "API",
    shortcut: "",
    isDisabled: true,
  },
  {
    icon: "cloud-solid",
    title: "Gender",
    shortcut: "",
    children: [
      {
        title: "Male",
      },
      {
        title: "Female",
      },
    ],
    isRadio: true,
  },
  {
    title: "",
    shortcut: "",
    isSeparator: true,
  },
  {
    icon: "arrow-right-from-bracket-solid",
    title: "Logout",
    shortcut: "⇧⌘Q",
  },
]

const navigation = [
  { name: 'Dashboard', href: '#', value: 'dashboard' },
  { name: 'Team', href: '#', value: 'team' },
  { name: 'Projects', href: '#', value: 'projects' },
  { name: 'Calendar', href: '#', value: 'calender' },
]
type Props = {}

const SimpleNavbar = () => {
  return (
    <div className="mx-auto max-w-7xl border bg-background px-2 sm:px-4">
      <div className="relative flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
              width={100}
              height={100}
            />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Tabs defaultValue="dashboard">
                <TabsList className={"bg-background"}>
                  {navigation.map((item, i) => (
                    <TabsTrigger
                      value={item.value}
                      className="data-[state=active]:bg-muted"
                      key={i}
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div className="relative rounded-full p-1 text-secondary-foreground">
            <Icon name="bell-regular" className="h-6 w-6" aria-hidden="true" />
          </div>
          {/* Profile dropdown */}
          <div className="ml-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  size="sm"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {dropDownData.map((data: DropdownItem) => {
                    return (
                      <React.Fragment
                        key={Math.floor(Math.random() * 10000)?.toString()}
                      >
                        {data.isLabel ? (
                          <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        ) : data?.children?.length! > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map(
                                  (child: DropdownItem, idx: number) => {
                                    return (
                                      <DropdownMenuItem
                                        key={idx}
                                        disabled={data?.isDisabled}
                                      >
                                        {child?.icon && (
                                          <Icon
                                            name={child?.icon!}
                                            className="mr-2 h-4 w-4"
                                          />
                                        )}
                                        <span>{child.title}</span>
                                        <DropdownMenuShortcut>
                                          {child?.shortcut}
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    )
                                  }
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : data.isSeparator ? (
                          <DropdownMenuSeparator />
                        ) : (
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && (
                              <Icon
                                name={data?.icon!}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>
                              {data?.shortcut}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

const QuickActionNavbar = () => {
  return (
    <div className="mx-auto max-w-7xl border bg-background px-2 sm:px-4">
      <div className="relative flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
              width={100}
              height={100}
            />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Tabs defaultValue="dashboard">
                <TabsList className={"bg-background"}>
                  {navigation.map((item, i) => (
                    <TabsTrigger
                      value={item.value}
                      className="data-[state=active]:bg-muted"
                      key={i}
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <Button icon="plus-regular">New Job</Button>
          <div className="relative ml-3 rounded-full p-1 text-secondary-foreground">
            <Icon name="bell-regular" className="h-6 w-6" aria-hidden="true" />
          </div>
          {/* Profile dropdown */}
          <div className="ml-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  size="sm"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {dropDownData.map((data: DropdownItem) => {
                    return (
                      <React.Fragment
                        key={Math.floor(Math.random() * 10000)?.toString()}
                      >
                        {data.isLabel ? (
                          <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        ) : data?.children?.length! > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map(
                                  (child: DropdownItem, idx: number) => {
                                    return (
                                      <DropdownMenuItem
                                        key={idx}
                                        disabled={data?.isDisabled}
                                      >
                                        {child?.icon && (
                                          <Icon
                                            name={child?.icon!}
                                            className="mr-2 h-4 w-4"
                                          />
                                        )}
                                        <span>{child.title}</span>
                                        <DropdownMenuShortcut>
                                          {child?.shortcut}
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    )
                                  }
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : data.isSeparator ? (
                          <DropdownMenuSeparator />
                        ) : (
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && (
                              <Icon
                                name={data?.icon!}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>
                              {data?.shortcut}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

const SimpleUnderLineMenuNavbar = () => {
  return (
    <div className="mx-auto max-w-7xl border px-2 sm:px-4">
      <div className="relative flex h-16 justify-between">
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
              width={100}
              height={100}
            />
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Tabs defaultValue="dashboard" className="contents">
              <TabsList variant="underline" className={"contents bg-background"}>
                {navigation.map((item, i) => (
                  <TabsTrigger
                    value={item.value}
                    variant="underline"
                    key={i}
                  >
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div className="relative ml-3 rounded-full p-1 text-secondary-foreground">
            <Icon name="bell-regular" className="h-6 w-6" aria-hidden="true" />
          </div>

          {/* Profile dropdown */}
          {/* Profile dropdown */}
          <div className="ml-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  size="sm"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {dropDownData.map((data: DropdownItem) => {
                    return (
                      <React.Fragment
                        key={Math.floor(Math.random() * 10000)?.toString()}
                      >
                        {data.isLabel ? (
                          <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        ) : data?.children?.length! > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map(
                                  (child: DropdownItem, idx: number) => {
                                    return (
                                      <DropdownMenuItem
                                        key={idx}
                                        disabled={data?.isDisabled}
                                      >
                                        {child?.icon && (
                                          <Icon
                                            name={child?.icon!}
                                            className="mr-2 h-4 w-4"
                                          />
                                        )}
                                        <span>{child.title}</span>
                                        <DropdownMenuShortcut>
                                          {child?.shortcut}
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    )
                                  }
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : data.isSeparator ? (
                          <DropdownMenuSeparator />
                        ) : (
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && (
                              <Icon
                                name={data?.icon!}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>
                              {data?.shortcut}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

const SearchNavbar = () => {
  return (
    <div className="mx-auto max-w-7xl border bg-background px-2 sm:px-4">
      <div className="relative flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
              width={100}
              height={100}
            />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Tabs defaultValue="dashboard">
                <TabsList className={"bg-background"}>
                  {navigation.map((item, i) => (
                    <TabsTrigger
                      value={item.value}
                      className="data-[state=active]:bg-muted"
                      key={i}
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center space-x-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div>
            <Input icon="magnifying-glass-regular" borderStyleForAddOn="iconWithLabel" placeholder="Search" />
          </div>
          <div className="relative rounded-full p-1 text-secondary-foreground">
            <Icon name="bell-regular" className="h-6 w-6" aria-hidden="true" />
          </div>
          {/* Profile dropdown */}
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  size="sm"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {dropDownData.map((data: DropdownItem) => {
                    return (
                      <React.Fragment
                        key={Math.floor(Math.random() * 10000)?.toString()}
                      >
                        {data.isLabel ? (
                          <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        ) : data?.children?.length! > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map(
                                  (child: DropdownItem, idx: number) => {
                                    return (
                                      <DropdownMenuItem
                                        key={idx}
                                        disabled={data?.isDisabled}
                                      >
                                        {child?.icon && (
                                          <Icon
                                            name={child?.icon!}
                                            className="mr-2 h-4 w-4"
                                          />
                                        )}
                                        <span>{child.title}</span>
                                        <DropdownMenuShortcut>
                                          {child?.shortcut}
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    )
                                  }
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : data.isSeparator ? (
                          <DropdownMenuSeparator />
                        ) : (
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && (
                              <Icon
                                name={data?.icon!}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>
                              {data?.shortcut}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

const CenteredSearchAndLinks = () => {
  return (
    <div className="mx-auto max-w-7xl border bg-background px-2 sm:px-4">
      <div className="relative flex h-16 justify-between border-b">
        <div className="relative z-10 flex px-2 lg:px-0">
          <div className="flex shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <Input icon="magnifying-glass-regular" borderStyleForAddOn="iconWithLabel" placeholder="Search" />

            </div>
          </div>
        </div>

        <div className="hidden space-x-3 lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
          <div className="relative rounded-full p-1 text-secondary-foreground">
            <Icon name="bell-regular" className="h-6 w-6" aria-hidden="true" />
          </div>

          {/* Profile dropdown */}
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  size="sm"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {dropDownData.map((data: DropdownItem) => {
                    return (
                      <React.Fragment
                        key={Math.floor(Math.random() * 10000)?.toString()}
                      >
                        {data.isLabel ? (
                          <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        ) : data?.children?.length! > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map(
                                  (child: DropdownItem, idx: number) => {
                                    return (
                                      <DropdownMenuItem
                                        key={idx}
                                        disabled={data?.isDisabled}
                                      >
                                        {child?.icon && (
                                          <Icon
                                            name={child?.icon!}
                                            className="mr-2 h-4 w-4"
                                          />
                                        )}
                                        <span>{child.title}</span>
                                        <DropdownMenuShortcut>
                                          {child?.shortcut}
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    )
                                  }
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : data.isSeparator ? (
                          <DropdownMenuSeparator />
                        ) : (
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && (
                              <Icon
                                name={data?.icon!}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>
                              {data?.shortcut}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <nav className="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
        <Tabs defaultValue="dashboard">
          <TabsList className={"bg-background"}>
            {navigation.map((item, i) => (
              <TabsTrigger
                value={item.value}
                className="data-[state=active]:bg-muted"
                key={i}
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>
    </div>
  )
}

const CenteredSearchColumn = () => {
  return (
    <div className="mx-auto max-w-7xl border bg-background px-2 sm:px-4">
      <div className="relative flex h-16 justify-between">
        <div className="relative z-10 flex px-2 lg:px-0">
          <div className="flex shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <Input icon="magnifying-glass-regular" borderStyleForAddOn="iconWithLabel" placeholder="Search" />
            </div>
          </div>
        </div>

        <div className="hidden space-x-3 lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
          <div className="relative rounded-full p-1 text-secondary-foreground">
            <Icon name="bell-regular" className="h-6 w-6" aria-hidden="true" />
          </div>

          {/* Profile dropdown */}
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  size="sm"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {dropDownData.map((data: DropdownItem) => {
                    return (
                      <React.Fragment
                        key={Math.floor(Math.random() * 10000)?.toString()}
                      >
                        {data.isLabel ? (
                          <DropdownMenuLabel>{data.title}</DropdownMenuLabel>
                        ) : data?.children?.length! > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>{data.title}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {data?.children?.map(
                                  (child: DropdownItem, idx: number) => {
                                    return (
                                      <DropdownMenuItem
                                        key={idx}
                                        disabled={data?.isDisabled}
                                      >
                                        {child?.icon && (
                                          <Icon
                                            name={child?.icon!}
                                            className="mr-2 h-4 w-4"
                                          />
                                        )}
                                        <span>{child.title}</span>
                                        <DropdownMenuShortcut>
                                          {child?.shortcut}
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    )
                                  }
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : data.isSeparator ? (
                          <DropdownMenuSeparator />
                        ) : (
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && (
                              <Icon
                                name={data?.icon!}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>
                              {data?.shortcut}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
const Navbars = (props: Props) => {
  return (
    <Card>
      <CardContent className="space-y-2 p-2">
        <SimpleNavbar />
        <QuickActionNavbar />
        <SimpleUnderLineMenuNavbar />
        <SearchNavbar />
        <CenteredSearchAndLinks />
        <CenteredSearchColumn />
      </CardContent>
    </Card>
  )
}

export default Navbars
