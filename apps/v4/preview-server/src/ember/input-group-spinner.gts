import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/ember-ui/input-group';
import { Spinner } from '@/ember-ui/spinner';

import LoaderIcon from '~icons/lucide/loader';

<template>
  <div class="grid w-full max-w-sm gap-4">
    <InputGroup data-disabled>
      <InputGroupInput disabled placeholder="Searching..." />
      <InputGroupAddon @align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>

    <InputGroup data-disabled>
      <InputGroupInput disabled placeholder="Processing..." />
      <InputGroupAddon>
        <Spinner />
      </InputGroupAddon>
    </InputGroup>

    <InputGroup data-disabled>
      <InputGroupInput disabled placeholder="Saving changes..." />
      <InputGroupAddon @align="inline-end">
        <InputGroupText>Saving...</InputGroupText>
        <Spinner />
      </InputGroupAddon>
    </InputGroup>

    <InputGroup data-disabled>
      <InputGroupInput disabled placeholder="Refreshing data..." />
      <InputGroupAddon>
        <LoaderIcon class="animate-spin" />
      </InputGroupAddon>
      <InputGroupAddon @align="inline-end">
        <InputGroupText @class="text-muted-foreground">
          Please wait...
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
