import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Switch } from '@/ember-ui/switch';

<template>
  <Field @orientation="horizontal" class="max-w-sm" data-invalid>
    <FieldContent>
      <FieldLabel @for="switch-terms">Accept terms and conditions</FieldLabel>
      <FieldDescription>
        You must accept the terms and conditions to continue.
      </FieldDescription>
    </FieldContent>
    <Switch aria-invalid="true" id="switch-terms" />
  </Field>
</template>
