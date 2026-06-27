import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Textarea } from '@/ember-ui/textarea';

<template>
  <Field>
    <FieldLabel @for="textarea-message">Message</FieldLabel>
    <FieldDescription>Enter your message below.</FieldDescription>
    <Textarea id="textarea-message" placeholder="Type your message here." />
  </Field>
</template>
