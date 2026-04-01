import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <div class="w-full max-w-md">
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel @for="username">Username</FieldLabel>
          <Input id="username" placeholder="Max Leiter" type="text" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel @for="password">Password</FieldLabel>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input id="password" placeholder="••••••••" type="password" />
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>
</template>
