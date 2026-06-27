import { Badge } from '@/ember-ui/badge';
import {
  Field,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field>
    <FieldLabel @for="input-badge">
      Webhook URL
      <Badge @variant="secondary" class="ml-auto">Beta</Badge>
    </FieldLabel>
    <Input
      id="input-badge"
      type="url"
      placeholder="https://api.example.com/webhook"
    />
  </Field>
</template>
