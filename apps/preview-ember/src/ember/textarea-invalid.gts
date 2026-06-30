import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Textarea } from '@/ember-ui/textarea';

<template>
  <Field data-invalid>
    <FieldLabel @for="textarea-invalid">Message</FieldLabel>
    <Textarea
      id="textarea-invalid"
      placeholder="Type your message here."
      aria-invalid="true"
    />
    <FieldDescription>Please enter a valid message.</FieldDescription>
  </Field>
</template>
