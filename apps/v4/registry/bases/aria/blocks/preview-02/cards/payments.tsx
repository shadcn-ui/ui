"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/registry/bases/aria/ui/breadcrumb"
import { Button } from "@/registry/bases/aria/ui/button"
import { Card, CardContent, CardHeader } from "@/registry/bases/aria/ui/card"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/aria/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/aria/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function Payments() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <DropdownMenuTrigger>
                <Button size="icon-sm" variant="ghost">
                  <IconPlaceholder
                    lucide="MoreHorizontalIcon"
                    tabler="IconDots"
                    hugeicons="MoreHorizontalCircle01Icon"
                    phosphor="DotsThreeIcon"
                    remixicon="RiMoreLine"
                  />
                  <span className="sr-only">Account options</span>
                </Button>
                <DropdownMenu placement="bottom start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Statements</DropdownMenuItem>
                    <DropdownMenuItem>Documents</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenu>
              </DropdownMenuTrigger>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Payments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item variant="muted" href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="GaugeIcon"
                tabler="IconGauge"
                hugeicons="Settings01Icon"
                phosphor="GaugeIcon"
                remixicon="RiDashboardLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Change transfer limit</ItemTitle>
              <ItemDescription>
                Adjust how much you can send from your balance.
              </ItemDescription>
            </ItemContent>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Item>
          <Item variant="muted" href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="CalendarIcon"
                tabler="IconCalendar"
                hugeicons="Calendar03Icon"
                phosphor="CalendarIcon"
                remixicon="RiCalendarLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Scheduled transfers</ItemTitle>
              <ItemDescription>
                Set up a transfer to send at a later date.
              </ItemDescription>
            </ItemContent>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Item>
          <Item variant="muted" href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="RepeatIcon"
                tabler="IconRepeat"
                hugeicons="RepeatIcon"
                phosphor="RepeatIcon"
                remixicon="RiRepeatLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Direct Debits</ItemTitle>
              <ItemDescription>
                Set up and manage regular payments.
              </ItemDescription>
            </ItemContent>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Item>
          <Item variant="muted" href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="RefreshCwIcon"
                tabler="IconRefresh"
                hugeicons="RepeatIcon"
                phosphor="ArrowsClockwiseIcon"
                remixicon="RiRefreshLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Recurring card payments</ItemTitle>
              <ItemDescription>
                Manage your repeated card transactions.
              </ItemDescription>
            </ItemContent>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
