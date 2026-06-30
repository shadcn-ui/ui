import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Switch } from '@/ember-ui/switch';

<template>
  <Field @orientation="horizontal" class="max-w-sm">
    <FieldContent>
      <FieldLabel @for="switch-focus-mode">Share across devices</FieldLabel>
      <FieldDescription>
        Focus is shared across devices, and turns off when you leave the app.
      </FieldDescription>
    </FieldContent>
    <Switch id="switch-focus-mode" />
  </Field>
</template>
