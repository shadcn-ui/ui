import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  Field,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field>
    <FieldLabel @for="input-button-group">Search</FieldLabel>
    <ButtonGroup>
      <Input id="input-button-group" placeholder="Type to search..." />
      <Button @variant="outline">Search</Button>
    </ButtonGroup>
  </Field>
</template>
