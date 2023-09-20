"use client"
import { Button } from "@/registry/tui/ui/button"
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
} from "@/registry/tui/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Icon, IconType } from "../../ui/icon"
import React from "react"

interface DropdownItem {
  icon?: IconType;
  title: string;
  shortcut?: string;
  children?: DropdownItem[];
  isLabel?: boolean;
  isSeparator?: boolean;
  isDisabled?: boolean;
  isCheckBox?: boolean;
  isRadio?: boolean
}

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
    icon: "megaphone-solid",
    title: 'Announcements',
    isCheckBox: true
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
    isDisabled: true
  },
  {
    icon: "cloud-solid",
    title: 'Gender',
    shortcut: '',
    children: [
      {
        title: 'Male'
      },
      {
        title: 'Female'
      }
    ],
    isRadio: true
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
  const [checked, setChecked] = React.useState<boolean>(false);
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
          1. With Icons, Dividers and Sub Menu : Aligned Start
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                            <DropdownMenuItem disabled={data?.isDisabled}>
                              {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                              <span>{data.title}</span>
                              <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          2. With Icons, Dividers and Sub Menu : Aligned End
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                            <DropdownMenuItem disabled={data?.isDisabled}>
                              {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                              <span>{data.title}</span>
                              <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          3. With Icons, Dividers and Sub Menu
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                            <DropdownMenuItem disabled={data?.isDisabled}>
                              {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                              <span>{data.title}</span>
                              <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          4. Without Icons & Dividers
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
                                      <span>{child.title}</span>
                                      <DropdownMenuShortcut>{child?.shortcut}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          :
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          5. With Dividers
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                            <DropdownMenuItem disabled={data?.isDisabled}>
                              <span>{data.title}</span>
                              <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          6. With Icons
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          7. With minimal menu icon
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
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                          <DropdownMenuItem disabled={data?.isDisabled}>
                            {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                            <span>{data.title}</span>
                            <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          8. With CheckBox & Radio in MenuItem
        </CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {dropDownData.map((data: DropdownItem) => {
                return (
                  <React.Fragment key={(Math.floor(Math.random() * 10000))?.toString()}>
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
                                    <DropdownMenuItem key={idx} disabled={data?.isDisabled}>
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
                          data?.isCheckBox ?
                            <DropdownMenuCheckboxItem
                              checked={checked}
                              onCheckedChange={setChecked}
                            >
                              {data.title}
                            </DropdownMenuCheckboxItem>
                            :
                            data?.isRadio ?
                              data?.children?.length! > 0 ?
                                <DropdownMenuRadioGroup>
                                  {data?.children?.map((child: any, idx: number) => {
                                    return (
                                      <DropdownMenuRadioItem value={child.title?.toLowerCase()} key={idx}>
                                        {child.title}
                                      </DropdownMenuRadioItem>
                                    )
                                  })}
                                </DropdownMenuRadioGroup>
                                :
                                <DropdownMenuRadioItem value={data.title?.toLowerCase()}>
                                  {data.title}
                                </DropdownMenuRadioItem>
                              :
                              <DropdownMenuItem disabled={data?.isDisabled}>
                                {data?.icon && <Icon name={data?.icon!} className="mr-2 h-4 w-4" />}
                                <span>{data.title}</span>
                                <DropdownMenuShortcut>{data?.shortcut}</DropdownMenuShortcut>
                              </DropdownMenuItem>
                    }
                  </React.Fragment>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
