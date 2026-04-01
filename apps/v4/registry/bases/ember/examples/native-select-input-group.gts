import { InputGroup, InputGroupAddon } from '@/ui/input-group';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/ui/native-select';

import DollarSign from '~icons/lucide/dollar-sign';

<template>
  <div class="w-full max-w-sm space-y-4">
    <InputGroup>
      <InputGroupAddon>
        <DollarSign class="size-4" />
      </InputGroupAddon>
      <NativeSelect>
        <NativeSelectOption value="">Currency</NativeSelectOption>
        <NativeSelectOption value="usd">USD</NativeSelectOption>
        <NativeSelectOption value="eur">EUR</NativeSelectOption>
        <NativeSelectOption value="gbp">GBP</NativeSelectOption>
        <NativeSelectOption value="jpy">JPY</NativeSelectOption>
      </NativeSelect>
    </InputGroup>

    <InputGroup>
      <NativeSelect>
        <NativeSelectOption value="">Protocol</NativeSelectOption>
        <NativeSelectOption value="https">HTTPS</NativeSelectOption>
        <NativeSelectOption value="http">HTTP</NativeSelectOption>
        <NativeSelectOption value="ftp">FTP</NativeSelectOption>
      </NativeSelect>
      <InputGroupAddon>://</InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <NativeSelect>
        <NativeSelectOption value="">Country</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
      </NativeSelect>
      <InputGroupAddon>/</InputGroupAddon>
      <NativeSelect>
        <NativeSelectOption value="">State</NativeSelectOption>
        <NativeSelectOption value="ca">California</NativeSelectOption>
        <NativeSelectOption value="ny">New York</NativeSelectOption>
        <NativeSelectOption value="tx">Texas</NativeSelectOption>
      </NativeSelect>
    </InputGroup>
  </div>
</template>
