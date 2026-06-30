import { Checkbox } from '@/ember-ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/ember-ui/field';

<template>
  <FieldGroup class="mx-auto w-56">
    <Field @orientation="horizontal" data-invalid>
      <Checkbox
        aria-invalid="true"
        id="terms-checkbox-invalid"
        name="terms-checkbox-invalid"
      />
      <FieldLabel @for="terms-checkbox-invalid">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  </FieldGroup>
</template>
