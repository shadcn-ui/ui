import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '@/ember-ui/input-group';
import { Spinner } from '@/ember-ui/spinner';

import ArrowUp from '~icons/lucide/arrow-up';

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <InputGroup>
      <InputGroupInput disabled placeholder="Send a message..." />
      <InputGroupAddon @align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupTextarea disabled placeholder="Send a message..." />
      <InputGroupAddon @align="block-end">
        <Spinner />
        Validating...
        <InputGroupButton @variant="default" class="ml-auto">
          <ArrowUp />
          <span class="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
