import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field>
    <FieldLabel @for="input-required">
      Required Field <span class="text-destructive">*</span>
    </FieldLabel>
    <Input id="input-required" placeholder="This field is required" required />
    <FieldDescription>This field must be filled out.</FieldDescription>
  </Field>
</template>
