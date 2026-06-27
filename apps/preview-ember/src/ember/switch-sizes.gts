import { Field, FieldGroup, FieldLabel } from '@/ember-ui/field';
import { Switch } from '@/ember-ui/switch';

<template>
  <FieldGroup class="w-full max-w-[10rem]">
    <Field @orientation="horizontal">
      <Switch @size="sm" id="switch-size-sm" />
      <FieldLabel @for="switch-size-sm">Small</FieldLabel>
    </Field>
    <Field @orientation="horizontal">
      <Switch @size="default" id="switch-size-default" />
      <FieldLabel @for="switch-size-default">Default</FieldLabel>
    </Field>
  </FieldGroup>
</template>
