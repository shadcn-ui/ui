<script setup lang="ts">
import { ref } from 'vue'
import Building2Icon from "@material-symbols/svg-400/rounded/apartment.svg?component"
import CreditCardIcon from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import WalletIcon from "@material-symbols/svg-400/rounded/wallet.svg?component"

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

const paymentMethod = ref('card')
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">Payment Method</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
        <DropdownMenuRadioGroup :model-value="paymentMethod" @update:model-value="paymentMethod = $event as string">
          <DropdownMenuRadioItem value="card">
            <CreditCardIcon />
            Credit Card
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="paypal">
            <WalletIcon />
            PayPal
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bank">
            <Building2Icon />
            Bank Transfer
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
