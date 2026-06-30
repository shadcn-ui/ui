import { Checkbox } from '@/ember-ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/ember-ui/field';

<template>
  <FieldGroup class="mx-auto w-56">
    <Field @orientation="horizontal">
      <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
      <FieldLabel @for="terms-checkbox-basic">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  </FieldGroup>
</template>
