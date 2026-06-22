import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';

import Check from '~icons/material-symbols/check-rounded';
import CreditCard from '~icons/material-symbols/credit-card';
import Info from '~icons/material-symbols/info-outline-rounded';
import Mail from '~icons/material-symbols/mail-outline-rounded';
import Search from '~icons/material-symbols/search-rounded';
import Star from '~icons/material-symbols/star-outline-rounded';

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
