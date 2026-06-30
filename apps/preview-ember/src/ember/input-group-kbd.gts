import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';
import { Kbd } from '@/ember-ui/kbd';

import Search from '~icons/ms/search';

<template>
  <InputGroup @class="max-w-sm">
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <Search class="text-muted-foreground" />
    </InputGroupAddon>
    <InputGroupAddon @align="inline-end">
      <Kbd>⌘K</Kbd>
    </InputGroupAddon>
  </InputGroup>
</template>
