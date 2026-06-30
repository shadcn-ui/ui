import { Field, FieldLabel } from '@/ember-ui/field';
import { Textarea } from '@/ember-ui/textarea';

<template>
  <Field data-disabled>
    <FieldLabel @for="textarea-disabled">Message</FieldLabel>
    <Textarea
      id="textarea-disabled"
      placeholder="Type your message here."
      disabled
    />
  </Field>
</template>
