import { Checkbox } from '@/ui/checkbox';
import { Field, FieldLabel } from '@/ui/field';

<template>
  <FieldLabel for="checkbox-demo">
    <Field @orientation="horizontal">
      <Checkbox @checked={{true}} id="checkbox-demo" />
      <FieldLabel @class="line-clamp-1" for="checkbox-demo">
        I agree to the terms and conditions
      </FieldLabel>
    </Field>
  </FieldLabel>
</template>
