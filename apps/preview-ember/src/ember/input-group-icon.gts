import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';

import Check from '~icons/ms/check';
import CreditCard from '~icons/ms/credit_card';
import Info from '~icons/ms/info';
import Mail from '~icons/ms/mail';
import Search from '~icons/ms/search';
import Star from '~icons/ms/star';

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
