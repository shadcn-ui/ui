import {
  Field,
  FieldLabel,
} from '@/ember-ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/ember-ui/input-group';
import Info from '~icons/ms/info';

<template>
  <Field>
    <FieldLabel @for="input-group-url">Website URL</FieldLabel>
    <InputGroup>
      <InputGroupInput id="input-group-url" placeholder="example.com" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon @align="inline-end">
        <Info />
      </InputGroupAddon>
    </InputGroup>
  </Field>
</template>
