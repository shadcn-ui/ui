import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';

import Check from '~icons/lucide/check';
import CreditCard from '~icons/lucide/credit-card';
import Info from '~icons/lucide/info';
import Mail from '~icons/lucide/mail';
import Search from '~icons/lucide/search';
import Star from '~icons/lucide/star';

<template>
  <div class="grid w-full max-w-sm gap-6">
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput placeholder="Enter your email" type="email" />
      <InputGroupAddon>
        <Mail />
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon>
        <CreditCard />
      </InputGroupAddon>
      <InputGroupAddon @align="inline-end">
        <Check />
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon @align="inline-end">
        <Star />
        <Info />
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
