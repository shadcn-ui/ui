import { Field, FieldLabel } from '@/ember-ui/field';
import { Switch } from '@/ember-ui/switch';

<template>
  <Field @orientation="horizontal" data-disabled class="w-fit">
    <Switch @disabled={{true}} id="switch-disabled-unchecked" />
    <FieldLabel @for="switch-disabled-unchecked">Disabled</FieldLabel>
  </Field>
</template>
