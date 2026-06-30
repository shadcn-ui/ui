import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field data-invalid>
    <FieldLabel @for="input-invalid">Invalid Input</FieldLabel>
    <Input id="input-invalid" placeholder="Error" aria-invalid="true" />
    <FieldDescription>
      This field contains validation errors.
    </FieldDescription>
  </Field>
</template>
