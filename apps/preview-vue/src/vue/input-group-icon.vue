<script setup lang="ts">
import CheckIcon from "@material-symbols/svg-400/rounded/check.svg?component"
import CreditCardIcon from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import InfoIcon from "@material-symbols/svg-400/rounded/info.svg?component"
import MailIcon from "@material-symbols/svg-400/rounded/mail.svg?component"
import SearchIcon from "@material-symbols/svg-400/rounded/search.svg?component"
import StarIcon from "@material-symbols/svg-400/rounded/star.svg?component"
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
