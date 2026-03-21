"use client"

import * as React from "react"
import { Button } from "@/examples/react-aria/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/examples/react-aria/ui/dropdown-menu"
import { Building2Icon, CreditCardIcon, WalletIcon } from "lucide-react"

export function DropdownMenuRadioIcons() {
  const [paymentMethod, setPaymentMethod] = React.useState("card")

  return (
    <DropdownMenuTrigger>
      <Button variant="outline">Payment Method</Button>
      <DropdownMenu className="min-w-56">
        <DropdownMenuGroup
          selectionMode="single"
          selectedKeys={[paymentMethod]}
          onSelectionChange={(keys) => setPaymentMethod([...keys][0] as string)}
        >
          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
          <DropdownMenuItem id="card">
            <CreditCardIcon />
            Credit Card
          </DropdownMenuItem>
          <DropdownMenuItem id="paypal">
            <WalletIcon />
            PayPal
          </DropdownMenuItem>
          <DropdownMenuItem id="bank">
            <Building2Icon />
            Bank Transfer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}
