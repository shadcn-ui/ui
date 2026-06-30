import { Button } from '@/ember-ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <FieldGroup>
    <Field>
      <FieldLabel @for="fieldgroup-name">Name</FieldLabel>
      <Input id="fieldgroup-name" placeholder="Jordan Lee" />
    </Field>
    <Field>
      <FieldLabel @for="fieldgroup-email">Email</FieldLabel>
      <Input id="fieldgroup-email" type="email" placeholder="name@example.com" />
      <FieldDescription>
        We'll send updates to this address.
      </FieldDescription>
    </Field>
    <Field @orientation="horizontal">
      <Button type="reset" @variant="outline">Reset</Button>
      <Button type="submit">Submit</Button>
    </Field>
  </FieldGroup>
</template>
