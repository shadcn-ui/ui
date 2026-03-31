<script setup lang="ts">
import { CheckIcon, CreditCardIcon, InfoIcon, MailIcon, SearchIcon, StarIcon } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/ui/input-group'
</script>

<template>
  <div class="grid w-full max-w-sm gap-6">
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput type="email" placeholder="Enter your email" />
      <InputGroupAddon>
        <MailIcon />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon>
        <CreditCardIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <CheckIcon />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon align="inline-end">
        <StarIcon />
        <InfoIcon />
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
