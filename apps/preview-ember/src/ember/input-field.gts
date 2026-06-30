import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field>
    <FieldLabel @for="input-field-username">Username</FieldLabel>
    <Input
      id="input-field-username"
      type="text"
      placeholder="Enter your username"
    />
    <FieldDescription>
      Choose a unique username for your account.
    </FieldDescription>
  </Field>
</template>
