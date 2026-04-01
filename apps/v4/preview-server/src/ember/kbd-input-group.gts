import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';
import { Kbd } from '@/ember-ui/kbd';

import SearchIcon from '~icons/lucide/search';

<template>
  <div class="flex w-full max-w-xs flex-col gap-6">
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon @align="inline-end">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
