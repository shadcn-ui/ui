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

import EyeOff from '~icons/ms/visibility_off';

<template>
  <Field @class="max-w-sm">
    <FieldLabel @for="inline-end-input">Input</FieldLabel>
    <InputGroup>
      <InputGroupInput
        id="inline-end-input"
        type="password"
        placeholder="Enter password"
      />
      <InputGroupAddon @align="inline-end">
        <EyeOff />
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Icon positioned at the end.</FieldDescription>
  </Field>
</template>
