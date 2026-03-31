<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components/example"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"

const paymentMethod = ref("card")
</script>

<template>
  <Example title="Radio with Icons">
    <DropdownMenu>
      <DropdownMenuTrigger :as-child="true">
        <Button variant="outline">
          Payment Method
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
          <DropdownMenuRadioGroup v-model="paymentMethod">
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
</template>
