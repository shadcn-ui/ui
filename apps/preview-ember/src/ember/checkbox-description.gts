import { Checkbox } from '@/ember-ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';

<template>
  <FieldGroup class="mx-auto w-72">
    <Field @orientation="horizontal">
      <Checkbox
        @checked={{true}}
        id="terms-checkbox-desc"
        name="terms-checkbox-desc"
      />
      <FieldContent>
        <FieldLabel @for="terms-checkbox-desc">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </FieldDescription>
      </FieldContent>
    </Field>
  </FieldGroup>
</template>
