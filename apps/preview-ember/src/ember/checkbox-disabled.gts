import { Checkbox } from '@/ember-ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/ember-ui/field';

<template>
  <FieldGroup class="mx-auto w-56">
    <Field @orientation="horizontal" data-disabled>
      <Checkbox
        @disabled={{true}}
        id="toggle-checkbox-disabled"
        name="toggle-checkbox-disabled"
      />
      <FieldLabel @for="toggle-checkbox-disabled">
        Enable notifications
      </FieldLabel>
    </Field>
  </FieldGroup>
</template>
