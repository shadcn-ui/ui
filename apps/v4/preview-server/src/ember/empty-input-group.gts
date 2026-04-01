import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/ember-ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';
import { Kbd } from '@/ember-ui/kbd';

import Search from '~icons/lucide/search';

<template>
  <Empty>
    <EmptyHeader>
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>
        The page you're looking for doesn't exist. Try searching for what you
        need below.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <InputGroup @class="sm:w-3/4">
        <InputGroupInput @placeholder="Try searching for pages..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon @align="inline-end">
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <EmptyDescription>
        Need help?
        <a href="#">Contact support</a>
      </EmptyDescription>
    </EmptyContent>
  </Empty>
</template>
