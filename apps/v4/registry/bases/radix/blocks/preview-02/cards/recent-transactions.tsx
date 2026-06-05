"use client"

import * as React from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/registry/bases/radix/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest account activity.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-10">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <IconPlaceholder
                    className="size-4 shrink-0"
                    lucide="CoffeeIcon"
                    tabler="IconCoffee"
                    hugeicons="CoffeeIcon"
                    phosphor="CoffeeIcon"
                    remixicon="RiCupLine"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">Blue Bottle Coffee</span>
                  <span className="text-sm text-muted-foreground">
                    Food & Drink
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Today, 10:24 AM
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-semibold tabular-nums">
                  -$6.50
                </span>
              </TableCell>
              <TableCell className="w-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <IconPlaceholder
                        lucide="MoreHorizontalIcon"
                        tabler="IconDotsVertical"
                        hugeicons="MoreVerticalCircle01Icon"
                        phosphor="DotsThreeIcon"
                        remixicon="RiMore2Line"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Add note</DropdownMenuItem>
                    <DropdownMenuItem>Categorize</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Dispute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-10">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <IconPlaceholder
                    className="size-4 shrink-0"
                    lucide="ShoppingCartIcon"
                    tabler="IconShoppingCart"
                    hugeicons="ShoppingCart01Icon"
                    phosphor="ShoppingCartIcon"
                    remixicon="RiShoppingCartLine"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">Whole Foods Market</span>
                  <span className="text-sm text-muted-foreground">
                    Groceries
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Yesterday
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-semibold tabular-nums">
                  -$142.30
                </span>
              </TableCell>
              <TableCell className="w-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <IconPlaceholder
                        lucide="MoreHorizontalIcon"
                        tabler="IconDotsVertical"
                        hugeicons="MoreVerticalCircle01Icon"
                        phosphor="DotsThreeIcon"
                        remixicon="RiMore2Line"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Add note</DropdownMenuItem>
                    <DropdownMenuItem>Categorize</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Dispute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-10">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <IconPlaceholder
                    className="size-4 shrink-0"
                    lucide="WalletIcon"
                    tabler="IconWallet"
                    hugeicons="Wallet01Icon"
                    phosphor="WalletIcon"
                    remixicon="RiWalletLine"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">Stripe Payout</span>
                  <span className="text-sm text-muted-foreground">Income</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Oct 12
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-semibold text-emerald-500 tabular-nums">
                  +$4,200.00
                </span>
              </TableCell>
              <TableCell className="w-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <IconPlaceholder
                        lucide="MoreHorizontalIcon"
                        tabler="IconDotsVertical"
                        hugeicons="MoreVerticalCircle01Icon"
                        phosphor="DotsThreeIcon"
                        remixicon="RiMore2Line"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Add note</DropdownMenuItem>
                    <DropdownMenuItem>Categorize</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Dispute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-10">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <IconPlaceholder
                    className="size-4 shrink-0"
                    lucide="CarIcon"
                    tabler="IconCar"
                    hugeicons="Car01Icon"
                    phosphor="CarIcon"
                    remixicon="RiCarLine"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">Uber Technologies</span>
                  <span className="text-sm text-muted-foreground">
                    Transport
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Oct 11
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-semibold tabular-nums">
                  -$24.10
                </span>
              </TableCell>
              <TableCell className="w-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <IconPlaceholder
                        lucide="MoreHorizontalIcon"
                        tabler="IconDotsVertical"
                        hugeicons="MoreVerticalCircle01Icon"
                        phosphor="DotsThreeIcon"
                        remixicon="RiMore2Line"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Add note</DropdownMenuItem>
                    <DropdownMenuItem>Categorize</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Dispute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-10">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <IconPlaceholder
                    className="size-4 shrink-0"
                    lucide="TvIcon"
                    tabler="IconDeviceTv"
                    hugeicons="Tv01Icon"
                    phosphor="TelevisionIcon"
                    remixicon="RiTvLine"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">Netflix Subscription</span>
                  <span className="text-sm text-muted-foreground">
                    Entertainment
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Oct 10
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-semibold tabular-nums">
                  -$19.99
                </span>
              </TableCell>
              <TableCell className="w-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <IconPlaceholder
                        lucide="MoreHorizontalIcon"
                        tabler="IconDotsVertical"
                        hugeicons="MoreVerticalCircle01Icon"
                        phosphor="DotsThreeIcon"
                        remixicon="RiMore2Line"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Add note</DropdownMenuItem>
                    <DropdownMenuItem>Categorize</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Dispute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
