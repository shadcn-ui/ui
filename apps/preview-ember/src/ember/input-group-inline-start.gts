import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ember-ui/input-group';

import Search from '~icons/ms/search';

<template>
  <Field @class="max-w-sm">
    <FieldLabel @for="inline-start-input">Input</FieldLabel>
    <InputGroup>
      <InputGroupInput id="inline-start-input" placeholder="Search..." />
      <InputGroupAddon @align="inline-start">
        <Search class="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Icon positioned at the start.</FieldDescription>
  </Field>
</template>
